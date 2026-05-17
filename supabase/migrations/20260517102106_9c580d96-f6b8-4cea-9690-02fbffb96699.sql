
-- Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS consistency_score int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp int NOT NULL DEFAULT 0;

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail text,
  difficulty text NOT NULL DEFAULT 'Beginner',
  category text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published courses" ON public.courses FOR SELECT USING (published = true);
CREATE POLICY "Tutors view own courses" ON public.courses FOR SELECT USING (auth.uid() = tutor_id);
CREATE POLICY "Admins view all courses" ON public.courses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Tutors insert own courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = tutor_id AND public.has_role(auth.uid(), 'tutor'));
CREATE POLICY "Tutors update own courses" ON public.courses FOR UPDATE USING (auth.uid() = tutor_id);
CREATE POLICY "Tutors delete own courses" ON public.courses FOR DELETE USING (auth.uid() = tutor_id);
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MODULES
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text,
  pdf_url text,
  duration_min int DEFAULT 0,
  order_number int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view modules of published courses" ON public.modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.published = true));
CREATE POLICY "Tutors manage own modules" ON public.modules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.tutor_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.tutor_id = auth.uid()));
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own enrollments" ON public.enrollments FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Tutors view enrollments of own courses" ON public.enrollments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.tutor_id = auth.uid()));
CREATE POLICY "Admins view all enrollments" ON public.enrollments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view quizzes of published courses" ON public.quizzes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = module_id AND c.published = true
  ));
CREATE POLICY "Tutors manage own quizzes" ON public.quizzes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = module_id AND c.tutor_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = module_id AND c.tutor_id = auth.uid()
  ));
CREATE POLICY "Admins manage quizzes" ON public.quizzes FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ RESULTS
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score int NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own quiz results" ON public.quiz_results FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Tutors view results for own quizzes" ON public.quiz_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quizzes q JOIN public.modules m ON m.id = q.module_id JOIN public.courses c ON c.id = m.course_id
    WHERE q.id = quiz_id AND c.tutor_id = auth.uid()
  ));
CREATE POLICY "Admins view all quiz results" ON public.quiz_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- BROADCASTS
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view broadcasts" ON public.broadcasts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tutors insert own broadcasts" ON public.broadcasts FOR INSERT WITH CHECK (auth.uid() = tutor_id AND public.has_role(auth.uid(), 'tutor'));
CREATE POLICY "Tutors update own broadcasts" ON public.broadcasts FOR UPDATE USING (auth.uid() = tutor_id);
CREATE POLICY "Tutors delete own broadcasts" ON public.broadcasts FOR DELETE USING (auth.uid() = tutor_id);
CREATE POLICY "Admins manage broadcasts" ON public.broadcasts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- LIVE CLASSES
CREATE TABLE IF NOT EXISTS public.live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL,
  class_title text NOT NULL,
  meeting_link text,
  scheduled_date timestamptz NOT NULL,
  duration_min int NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view live classes" ON public.live_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tutors manage own live classes" ON public.live_classes FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id AND public.has_role(auth.uid(), 'tutor'));
CREATE POLICY "Admins manage live classes" ON public.live_classes FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  live_class_id uuid NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  attended boolean NOT NULL DEFAULT true,
  attendance_time timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, live_class_id)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own attendance" ON public.attendance FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Tutors view own class attendance" ON public.attendance FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.live_classes l WHERE l.id = live_class_id AND l.tutor_id = auth.uid()));
CREATE POLICY "Admins view attendance" ON public.attendance FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- PAPER TRADES
CREATE TABLE IF NOT EXISTS public.paper_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  stock_name text NOT NULL,
  ticker text NOT NULL,
  buy_price numeric NOT NULL,
  quantity int NOT NULL,
  current_price numeric NOT NULL,
  profit_loss numeric GENERATED ALWAYS AS ((current_price - buy_price) * quantity) STORED,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own paper trades" ON public.paper_trades FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins view paper trades" ON public.paper_trades FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- WATCHLIST
CREATE TABLE IF NOT EXISTS public.watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ticker text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, ticker)
);
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
