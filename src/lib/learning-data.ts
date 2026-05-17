// Mock data for the role-based learning features (broadcasts, paper trading, live classes, consistency).

export const learningModules = [
  { id: "m1", title: "Stock Market Basics", lessons: 12, duration: "2h", progress: 100, level: "Beginner", color: "from-emerald-500 to-cyan-500" },
  { id: "m2", title: "Candlestick Patterns", lessons: 18, duration: "3h", progress: 72, level: "Beginner", color: "from-cyan-500 to-blue-500" },
  { id: "m3", title: "Technical Analysis", lessons: 24, duration: "4h", progress: 45, level: "Intermediate", color: "from-blue-500 to-violet-500" },
  { id: "m4", title: "Swing Trading", lessons: 20, duration: "3.5h", progress: 28, level: "Intermediate", color: "from-violet-500 to-pink-500" },
  { id: "m5", title: "Risk Management", lessons: 14, duration: "2h", progress: 60, level: "Intermediate", color: "from-amber-500 to-rose-500" },
  { id: "m6", title: "Options Trading", lessons: 32, duration: "6h", progress: 12, level: "Advanced", color: "from-rose-500 to-fuchsia-500" },
];

export const paperHoldings = [
  { ticker: "RELIANCE", qty:  8, avg: 2780.0, last: 2945.50 },
  { ticker: "TCS",      qty:  5, avg: 3940.0, last: 4112.20 },
  { ticker: "INFY",     qty: 12, avg: 1620.0, last: 1876.40 },
  { ticker: "HDFCBANK", qty: 15, avg: 1720.0, last: 1684.10 },
];

// Portfolio value in ₹ across the week (approx ₹1L).
export const paperEquityCurve = [
  { d: "Mon", v:  98420 }, { d: "Tue", v:  99840 }, { d: "Wed", v:  99610 },
  { d: "Thu", v: 101120 }, { d: "Fri", v: 102580 }, { d: "Sat", v: 103720 }, { d: "Sun", v: 105180 },
];

export const consistencyWeek = [
  { d: "Mon", score: 78 }, { d: "Tue", score: 92 }, { d: "Wed", score: 65 },
  { d: "Thu", score: 88 }, { d: "Fri", score: 95 }, { d: "Sat", score: 82 }, { d: "Sun", score: 90 },
];

export type Broadcast = {
  id: string; tutor: string; avatar: string; pinned?: boolean;
  type: "announcement" | "deadline" | "live" | "market";
  title: string; body: string; when: string;
};

export const broadcasts: Broadcast[] = [
  { id: "b1", tutor: "Coach Rohan", avatar: "R", pinned: true, type: "live",         title: "Live: Pre-market analysis",            body: "Join the 9:15 AM live session — we'll walk through NIFTY 50 & BANK NIFTY setups for the week.",   when: "in 30 min" },
  { id: "b2", tutor: "Coach Meera", avatar: "M",                type: "deadline",     title: "F&O assignment due Friday",            body: "Submit your covered-call write-up on RELIANCE in the F&O module. Late = -10 XP.",                when: "2h ago"    },
  { id: "b3", tutor: "Coach Rohan", avatar: "R",                type: "market",       title: "RBI policy today — what to watch",     body: "Key levels on NIFTY & BANK NIFTY, expected vol expansion, and how to position your paper book.", when: "5h ago"    },
  { id: "b4", tutor: "Coach Aisha", avatar: "A",                type: "announcement", title: "New module: Risk Management dropped",  body: "14 fresh lessons + 3 case studies on Indian markets. Earn 320 XP by completing it this week.",   when: "yesterday" },
];

export const liveClasses = [
  { id: "l1", title: "Pre-market briefing",       tutor: "Coach Rohan",  when: "Today · 9:15 AM",     duration: "30m", attendees: 412, status: "live"      as const },
  { id: "l2", title: "Candlestick masterclass",   tutor: "Coach Meera",  when: "Today · 6:00 PM",     duration: "45m", attendees: 287, status: "upcoming"  as const },
  { id: "l3", title: "Options Greeks deep-dive",  tutor: "Coach Aisha",  when: "Tomorrow · 7:00 PM",  duration: "60m", attendees: 198, status: "upcoming"  as const },
  { id: "l4", title: "Weekly portfolio review",   tutor: "Coach Rohan",  when: "Sat · 11:00 AM",      duration: "45m", attendees:   0, status: "scheduled" as const },
];

export const tutorsList = [
  { name: "Coach Rohan", email: "rohan@candlemind.io", students: 1240, courses: 6, rating: 4.9, status: "Approved" },
  { name: "Coach Meera", email: "meera@candlemind.io", students: 880, courses: 4, rating: 4.8, status: "Approved" },
  { name: "Coach Aisha", email: "aisha@candlemind.io", students: 612, courses: 3, rating: 4.7, status: "Approved" },
  { name: "Coach Vikram", email: "vikram@candlemind.io", students: 0, courses: 1, rating: 0, status: "Pending" },
  { name: "Coach Nisha", email: "nisha@candlemind.io", students: 0, courses: 0, rating: 0, status: "Pending" },
];

export const attendanceHeatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => Math.round(Math.random() * 100))
);
