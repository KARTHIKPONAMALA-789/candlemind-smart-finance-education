import { supabase } from "@/integrations/supabase/client";

// ---------- STUDENT ----------
export async function fetchStudentOverview(userId: string) {
  const [profile, enrollments, quizResults, paperTrades, watchlist, broadcasts] = await Promise.all([
    supabase.from("profiles").select("full_name, xp, streak, consistency_score").eq("id", userId).maybeSingle(),
    supabase.from("enrollments").select("id, completed, progress_percentage, course_id").eq("student_id", userId),
    supabase.from("quiz_results").select("score").eq("student_id", userId),
    supabase.from("paper_trades").select("*").eq("student_id", userId).order("created_at", { ascending: false }),
    supabase.from("watchlist").select("ticker").eq("user_id", userId),
    supabase.from("broadcasts").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const trades = paperTrades.data ?? [];
  const pnl = trades.reduce((s, t: any) => s + Number(t.profit_loss ?? (t.current_price - t.buy_price) * t.quantity), 0);
  const portfolio = trades.reduce((s, t: any) => s + Number(t.current_price) * Number(t.quantity), 0);
  const scores = (quizResults.data ?? []).map((q) => q.score);
  const avgQuiz = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return {
    profile: profile.data,
    enrollments: enrollments.data ?? [],
    completedCount: (enrollments.data ?? []).filter((e) => e.completed).length,
    avgQuiz,
    pnl,
    portfolio,
    watchlistCount: watchlist.data?.length ?? 0,
    paperTrades: trades,
    broadcasts: broadcasts.data ?? [],
  };
}

// ---------- TUTOR ----------
export async function fetchTutorOverview(userId: string) {
  const [courses, liveClasses, broadcasts] = await Promise.all([
    supabase.from("courses").select("id, title, category, difficulty, published, created_at").eq("tutor_id", userId).order("created_at", { ascending: false }),
    supabase.from("live_classes").select("*").eq("tutor_id", userId).order("scheduled_date", { ascending: false }),
    supabase.from("broadcasts").select("*").eq("tutor_id", userId).order("created_at", { ascending: false }),
  ]);

  const courseIds = (courses.data ?? []).map((c) => c.id);
  let enrollments: { course_id: string; student_id: string; completed: boolean; progress_percentage: number }[] = [];
  if (courseIds.length) {
    const { data } = await supabase.from("enrollments").select("course_id, student_id, completed, progress_percentage").in("course_id", courseIds);
    enrollments = data ?? [];
  }

  const studentSet = new Set(enrollments.map((e) => e.student_id));
  const perCourse = (courses.data ?? []).map((c) => {
    const rows = enrollments.filter((e) => e.course_id === c.id);
    const avgProgress = rows.length ? Math.round(rows.reduce((s, r) => s + r.progress_percentage, 0) / rows.length) : 0;
    return { ...c, students: rows.length, progress: avgProgress };
  });

  return {
    courses: perCourse,
    totalStudents: studentSet.size,
    liveClasses: liveClasses.data ?? [],
    broadcasts: broadcasts.data ?? [],
  };
}

// ---------- ADMIN ----------
export async function fetchAdminOverview() {
  const [roles, courses, enrollments, broadcasts, profiles, liveClasses] = await Promise.all([
    supabase.from("user_roles").select("user_id, role, created_at"),
    supabase.from("courses").select("id, title, tutor_id, published, created_at"),
    supabase.from("enrollments").select("id, course_id, student_id, completed, progress_percentage"),
    supabase.from("broadcasts").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("profiles").select("id, full_name, created_at"),
    supabase.from("live_classes").select("id, scheduled_date, tutor_id"),
  ]);

  const rolesData = roles.data ?? [];
  const profilesData = profiles.data ?? [];
  const profileById = new Map(profilesData.map((p) => [p.id, p]));

  const students = rolesData.filter((r) => r.role === "student");
  const tutors = rolesData.filter((r) => r.role === "tutor");

  return {
    totals: {
      students: students.length,
      tutors: tutors.length,
      courses: (courses.data ?? []).length,
      enrollments: (enrollments.data ?? []).length,
      liveClasses: (liveClasses.data ?? []).length,
    },
    students: students.map((r) => ({
      id: r.user_id,
      name: profileById.get(r.user_id)?.full_name ?? "Unknown",
      joined: profileById.get(r.user_id)?.created_at ?? r.created_at,
    })),
    tutors: tutors.map((r) => {
      const tutorCourses = (courses.data ?? []).filter((c) => c.tutor_id === r.user_id);
      const tutorEnroll = (enrollments.data ?? []).filter((e) => tutorCourses.some((c) => c.id === e.course_id));
      return {
        id: r.user_id,
        name: profileById.get(r.user_id)?.full_name ?? "Unknown",
        courses: tutorCourses.length,
        students: new Set(tutorEnroll.map((e) => e.student_id)).size,
      };
    }),
    broadcasts: broadcasts.data ?? [],
    courses: courses.data ?? [],
  };
}

export async function postBroadcast(input: { tutor_id: string; title: string; message: string; priority?: string }) {
  const { error } = await supabase.from("broadcasts").insert(input);
  if (error) throw error;
}
