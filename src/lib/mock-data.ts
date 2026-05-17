export const features = [
  { icon: "Brain", title: "AI Tutor", desc: "Personal AI mentor that explains markets in plain English, 24/7." },
  { icon: "LineChart", title: "Smart Screener", desc: "Filter 10,000+ stocks by sector, PE, market cap with live charts." },
  { icon: "GraduationCap", title: "Guided Courses", desc: "From candles to derivatives — bite-sized lessons with XP rewards." },
  { icon: "Trophy", title: "Gamified Learning", desc: "Streaks, XP, leaderboards. Learn finance like you play a game." },
  { icon: "Sparkles", title: "AI Insights", desc: "Daily market briefs generated for your portfolio and watchlist." },
  { icon: "Shield", title: "Risk Sandbox", desc: "Paper-trade with real prices before risking a single rupee." },
];

export const stats = [
  { label: "Active Learners", value: 128000, suffix: "+" },
  { label: "Lessons Completed", value: 2_400_000, suffix: "+" },
  { label: "Avg. Quiz Score", value: 87, suffix: "%" },
  { label: "Countries", value: 42, suffix: "" },
];

export const testimonials = [
  { name: "Aarav Mehta", role: "Engineering Student", quote: "I went from zero to confidently reading earnings reports in 6 weeks. The AI tutor is unreal.", avatar: "A" },
  { name: "Priya Shah", role: "Product Manager", quote: "CandleMind made me actually enjoy finance. The screener feels like Bloomberg, the UX feels like Linear.", avatar: "P" },
  { name: "Daniel Park", role: "Self-taught Trader", quote: "The gamified XP system kept me coming back daily. Hit a 90-day streak.", avatar: "D" },
];

export const pricing = [
  { name: "Starter", price: 0, period: "forever", features: ["3 courses", "Basic AI tutor", "Community access", "Daily quizzes"], cta: "Start free" },
  { name: "Pro", price: 19, period: "month", popular: true, features: ["All courses", "Unlimited AI tutor", "Advanced screener", "Paper trading", "XP boosts"], cta: "Go Pro" },
  { name: "Lifetime", price: 299, period: "once", features: ["Everything in Pro", "Lifetime updates", "1:1 mentor calls", "Early features", "Private Discord"], cta: "Buy lifetime" },
];

export const courses = [
  { id: 1, title: "Candlestick Foundations", cat: "Technical", level: "Beginner", lessons: 24, progress: 72, color: "from-emerald-500 to-cyan-500" },
  { id: 2, title: "Fundamental Analysis 101", cat: "Fundamental", level: "Beginner", lessons: 18, progress: 45, color: "from-cyan-500 to-blue-500" },
  { id: 3, title: "Reading Financial Statements", cat: "Fundamental", level: "Intermediate", lessons: 32, progress: 12, color: "from-blue-500 to-violet-500" },
  { id: 4, title: "Options & Derivatives", cat: "Advanced", level: "Advanced", lessons: 40, progress: 0, color: "from-violet-500 to-pink-500" },
  { id: 5, title: "Portfolio Construction", cat: "Strategy", level: "Intermediate", lessons: 22, progress: 88, color: "from-emerald-500 to-teal-500" },
  { id: 6, title: "Risk & Position Sizing", cat: "Strategy", level: "Intermediate", lessons: 16, progress: 30, color: "from-amber-500 to-rose-500" },
];

export const lessons = [
  { id: 1, title: "What is a Doji?", duration: "6 min", xp: 40 },
  { id: 2, title: "P/E Ratio explained", duration: "8 min", xp: 50 },
  { id: 3, title: "Support & Resistance", duration: "12 min", xp: 80 },
  { id: 4, title: "Reading a Balance Sheet", duration: "15 min", xp: 100 },
];

export const learningSeries = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 180 }, { day: "Wed", xp: 90 },
  { day: "Thu", xp: 220 }, { day: "Fri", xp: 260 }, { day: "Sat", xp: 140 }, { day: "Sun", xp: 310 },
];

export const completionSeries = [
  { name: "Technical", value: 38 },
  { name: "Fundamental", value: 27 },
  { name: "Strategy", value: 20 },
  { name: "Advanced", value: 15 },
];

export type Stock = {
  ticker: string; name: string; price: number; change: number;
  sector: string; mcap: string; pe: number; volume: string;
};

export const stocks: Stock[] = [
  { ticker: "AAPL", name: "Apple Inc.", price: 224.31, change: 1.24, sector: "Technology", mcap: "3.4T", pe: 32.1, volume: "48.2M" },
  { ticker: "NVDA", name: "NVIDIA Corp", price: 138.07, change: 3.92, sector: "Semiconductors", mcap: "3.3T", pe: 65.4, volume: "182.7M" },
  { ticker: "TSLA", name: "Tesla Inc.", price: 251.44, change: -2.11, sector: "Automotive", mcap: "800B", pe: 71.2, volume: "94.1M" },
  { ticker: "MSFT", name: "Microsoft", price: 421.55, change: 0.62, sector: "Technology", mcap: "3.1T", pe: 36.8, volume: "22.4M" },
  { ticker: "AMZN", name: "Amazon", price: 188.92, change: 1.87, sector: "E-commerce", mcap: "1.9T", pe: 48.2, volume: "38.6M" },
  { ticker: "META", name: "Meta Platforms", price: 561.10, change: -0.45, sector: "Technology", mcap: "1.4T", pe: 28.7, volume: "14.8M" },
  { ticker: "GOOG", name: "Alphabet", price: 178.34, change: 2.04, sector: "Technology", mcap: "2.2T", pe: 26.5, volume: "26.1M" },
  { ticker: "AMD", name: "Adv. Micro Dev", price: 142.21, change: 4.31, sector: "Semiconductors", mcap: "230B", pe: 192.0, volume: "65.3M" },
  { ticker: "JPM", name: "JPMorgan Chase", price: 218.45, change: 0.88, sector: "Finance", mcap: "620B", pe: 12.4, volume: "9.2M" },
  { ticker: "XOM", name: "Exxon Mobil", price: 117.23, change: -1.32, sector: "Energy", mcap: "510B", pe: 14.1, volume: "16.7M" },
  { ticker: "NFLX", name: "Netflix", price: 712.66, change: 2.45, sector: "Technology", mcap: "305B", pe: 47.9, volume: "4.1M" },
  { ticker: "BRK.B", name: "Berkshire Hathaway", price: 462.10, change: -0.21, sector: "Finance", mcap: "1.0T", pe: 9.6, volume: "3.8M" },
  { ticker: "V", name: "Visa Inc.", price: 296.78, change: 1.05, sector: "Finance", mcap: "590B", pe: 31.2, volume: "5.7M" },
  { ticker: "DIS", name: "Walt Disney", price: 102.34, change: -3.18, sector: "Technology", mcap: "186B", pe: 38.6, volume: "11.9M" },
  { ticker: "CVX", name: "Chevron", price: 158.92, change: -0.92, sector: "Energy", mcap: "295B", pe: 16.4, volume: "8.3M" },
  { ticker: "SHOP", name: "Shopify", price: 88.41, change: 5.62, sector: "E-commerce", mcap: "112B", pe: 78.3, volume: "22.6M" },
];

export const sectors = ["All", "Technology", "Semiconductors", "Automotive", "E-commerce", "Finance", "Energy"];

export const quizzes = [
  { q: "Which candlestick pattern signals indecision in the market?", a: ["Hammer", "Doji", "Engulfing", "Marubozu"], correct: 1 },
  { q: "P/E ratio is calculated as:", a: ["Price / Earnings", "Profit / Equity", "Price × Earnings", "Earnings / Price"], correct: 0 },
  { q: "What does 'support' mean in technical analysis?", a: ["Resistance level", "Price floor where buyers step in", "Trend reversal", "Dividend payout"], correct: 1 },
];

export const activity = [
  { who: "You", what: "completed lesson 'Doji & Spinning Top'", when: "2m ago" },
  { who: "AI Tutor", what: "generated a summary of TSLA Q3 earnings", when: "1h ago" },
  { who: "You", what: "earned 80 XP on Support & Resistance quiz", when: "3h ago" },
  { who: "Streak", what: "reached 42 days 🔥", when: "today" },
];

export const referralLeaders = [
  { rank: 1, name: "Priya Shah", refs: 142, earned: 2840 },
  { rank: 2, name: "Daniel Park", refs: 118, earned: 2360 },
  { rank: 3, name: "Aarav Mehta", refs: 96, earned: 1920 },
  { rank: 4, name: "You", refs: 28, earned: 560 },
  { rank: 5, name: "Sara Lin", refs: 22, earned: 440 },
];

export const referralChart = [
  { m: "Jan", clicks: 120, signups: 18 },
  { m: "Feb", clicks: 200, signups: 32 },
  { m: "Mar", clicks: 260, signups: 41 },
  { m: "Apr", clicks: 320, signups: 58 },
  { m: "May", clicks: 410, signups: 76 },
  { m: "Jun", clicks: 520, signups: 102 },
];

export const adminRevenue = [
  { m: "Jan", revenue: 12400, users: 820 },
  { m: "Feb", revenue: 18200, users: 1240 },
  { m: "Mar", revenue: 24800, users: 1860 },
  { m: "Apr", revenue: 32100, users: 2420 },
  { m: "May", revenue: 41200, users: 3180 },
  { m: "Jun", revenue: 52600, users: 4020 },
  { m: "Jul", revenue: 64900, users: 4880 },
];

export const adminCoursePerf = [
  { name: "Candlesticks", completion: 78 },
  { name: "Fundamentals", completion: 64 },
  { name: "Options", completion: 41 },
  { name: "Portfolio", completion: 72 },
  { name: "Risk", completion: 55 },
];

export const adminStudents = [
  { name: "Aarav Mehta", email: "aarav@mail.com", joined: "2025-09-12", course: "Candlesticks", status: "Active" },
  { name: "Priya Shah", email: "priya@mail.com", joined: "2025-08-03", course: "Fundamentals", status: "Active" },
  { name: "Daniel Park", email: "daniel@mail.com", joined: "2025-07-21", course: "Options", status: "Active" },
  { name: "Sara Lin", email: "sara@mail.com", joined: "2025-10-01", course: "Portfolio", status: "Trial" },
  { name: "Ravi Iyer", email: "ravi@mail.com", joined: "2025-06-18", course: "Risk", status: "Active" },
  { name: "Maya Chen", email: "maya@mail.com", joined: "2025-11-04", course: "Candlesticks", status: "Trial" },
];
