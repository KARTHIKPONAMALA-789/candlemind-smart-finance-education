import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Brain, LineChart, GraduationCap, Trophy, Shield,
  Check, Star, Play, Activity, Zap,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Counter } from "@/components/site/Counter";
import { features, stats, testimonials, pricing, learningSeries } from "@/lib/mock-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CandleMind — AI-powered fintech education" },
      { name: "description", content: "Learn the stock market like you play a game. AI tutor, smart screener, gamified courses." },
      { property: "og:title", content: "CandleMind" },
      { property: "og:description", content: "AI-powered fintech education for the next generation of investors." },
    ],
  }),
  component: Landing,
});

const iconMap = { Brain, LineChart, GraduationCap, Trophy, Sparkles, Shield };

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        <div className="absolute inset-0 [background:var(--gradient-hero)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-6"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            New · AI Tutor v2 with live market context
            <ArrowRight className="size-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-semibold tracking-tighter leading-[1.05]"
          >
            Master the markets.
            <br />
            <span className="gradient-text">Powered by AI.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            CandleMind teaches you stocks, options and analysis with a personal AI mentor,
            gamified XP, and a screener that feels like a trading terminal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/auth"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
            >
              Start learning free <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              to="/student-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-strong hover:bg-foreground/10 transition"
            >
              <Play className="size-4" /> View live demo
            </Link>
          </motion.div>

          {/* Floating preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute -inset-4 bg-[image:var(--gradient-primary)] opacity-30 blur-3xl rounded-3xl" />
            <div className="relative glass-strong rounded-3xl p-3 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-background/80 border border-border">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
                  <span className="size-2.5 rounded-full bg-destructive/60" />
                  <span className="size-2.5 rounded-full bg-warning/60" />
                  <span className="size-2.5 rounded-full bg-success/60" />
                  <span className="ml-3 text-xs text-muted-foreground">candlemind.app/student-dashboard</span>
                </div>
                <div className="grid md:grid-cols-3 gap-3 p-4">
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground">XP this week</div>
                    <div className="text-2xl font-display font-semibold mt-1 gradient-text">2,840</div>
                    <div className="text-xs text-primary mt-1">+18% vs last week</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground">Streak</div>
                    <div className="text-2xl font-display font-semibold mt-1">42 days 🔥</div>
                    <div className="text-xs text-muted-foreground mt-1">Top 3% of learners</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground">Mastery</div>
                    <div className="text-2xl font-display font-semibold mt-1">87%</div>
                    <div className="text-xs text-accent mt-1">Technical analysis</div>
                  </div>
                  <div className="md:col-span-3 glass rounded-xl p-4 h-56">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Daily XP</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="size-3 text-primary" /> live
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={learningSeries}>
                        <defs>
                          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                        <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                        <Area type="monotone" dataKey="xp" stroke="oklch(0.86 0.22 145)" strokeWidth={2} fill="url(#g)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGOS / STATS */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl glass-strong rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-semibold gradient-text">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs text-primary glass rounded-full px-3 py-1 mb-4">
              <Zap className="size-3" /> Built for self-taught investors
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Everything you need to <span className="gradient-text">go from zero to alpha</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              An AI tutor, a real screener, gamified courses — wired together into one premium product.
            </p>
          </div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f) => {
              const Icon = iconMap[f.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={f.title}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-6 relative overflow-hidden group"
                >
                  <div className="absolute -top-16 -right-16 size-48 rounded-full bg-[image:var(--gradient-primary)] opacity-0 group-hover:opacity-20 blur-3xl transition" />
                  <div className="relative">
                    <div className="size-10 rounded-xl glass-strong grid place-items-center mb-4 group-hover:glow transition">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section id="preview" className="px-6 mt-32">
        <div className="mx-auto max-w-6xl glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-96 bg-accent/20 blur-3xl rounded-full" />
          <div className="grid md:grid-cols-2 gap-10 items-center relative">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                A dashboard <span className="gradient-text">traders actually want</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Live progress, XP, streaks and AI-curated next lessons — all in a glassy,
                Linear-grade dashboard you'll keep open all day.
              </p>
              <ul className="mt-6 space-y-3">
                {["Personalized AI study plan", "TradingView-style charts", "XP streak gamification", "Real screener with 10K+ stocks"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <Link
                to="/student-dashboard"
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
              >
                Open the demo <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="glass rounded-2xl p-2">
              <img
                alt="Dashboard preview"
                className="rounded-xl"
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0%25' stop-color='%237dffae'/><stop offset='100%25' stop-color='%2360c4ff'/></linearGradient></defs><rect width='600' height='400' fill='%23151823'/><rect x='20' y='20' width='180' height='360' rx='12' fill='%23ffffff' fill-opacity='0.04'/><rect x='220' y='20' width='360' height='100' rx='12' fill='url(%23g)' fill-opacity='0.2'/><rect x='220' y='140' width='170' height='240' rx='12' fill='%23ffffff' fill-opacity='0.04'/><rect x='410' y='140' width='170' height='240' rx='12' fill='%23ffffff' fill-opacity='0.04'/><path d='M230 320 L260 280 L290 300 L320 240 L350 260 L380 200' stroke='url(%23g)' stroke-width='2' fill='none'/></svg>"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-center">
            Loved by <span className="gradient-text">128,000+ learners</span>
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Simple, <span className="gradient-text">scales with you</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready to go deep.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {pricing.map((p) => (
              <motion.div
                key={p.name} whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-6 ${p.popular ? "glass-strong gradient-border" : "glass"}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-6 text-xs px-2 py-0.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">
                    Most popular
                  </span>
                )}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-muted-foreground">/ {p.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`mt-6 block text-center py-2.5 rounded-xl font-medium transition
                    ${p.popular
                      ? "bg-[image:var(--gradient-primary)] text-primary-foreground hover:shadow-[var(--shadow-glow)]"
                      : "glass hover:bg-foreground/10"}`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl glass-strong p-12 md:p-16 text-center">
          <div className="absolute inset-0 [background:var(--gradient-hero)] opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Your AI investing mentor is <span className="gradient-text">one click away</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join thousands of learners turning market complexity into confident decisions.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
            >
              Get started free <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
