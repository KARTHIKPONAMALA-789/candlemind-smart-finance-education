export const features = [
  { icon: "Brain", title: "AI Tutor", desc: "Personal AI mentor that explains Indian markets in plain English, 24/7." },
  { icon: "LineChart", title: "Smart Screener", desc: "Filter NSE & BSE stocks by sector, P/E, market cap with live charts." },
  { icon: "GraduationCap", title: "Guided Courses", desc: "From candles to F&O — bite-sized lessons with XP rewards." },
  { icon: "Trophy", title: "Gamified Learning", desc: "Streaks, XP, leaderboards. Learn finance like you play a game." },
  { icon: "Sparkles", title: "AI Insights", desc: "Daily NIFTY & SENSEX briefs generated for your portfolio and watchlist." },
  { icon: "Shield", title: "Risk Sandbox", desc: "Paper-trade Indian stocks with real prices before risking a single rupee." },
];

export const stats = [
  { label: "Active Learners", value: 128000, suffix: "+" },
  { label: "Lessons Completed", value: 2_400_000, suffix: "+" },
  { label: "Avg. Quiz Score", value: 87, suffix: "%" },
  { label: "Indian Cities", value: 240, suffix: "+" },
];

export const testimonials = [
  { name: "Aarav Mehta", role: "Engineering Student, IIT-B", quote: "I went from zero to reading earnings of TCS and Reliance in 6 weeks. The AI tutor is unreal.", avatar: "A" },
  { name: "Priya Shah", role: "Product Manager, Bengaluru", quote: "CandleMind made me actually enjoy the markets. The screener feels like Zerodha Kite, the UX feels like Linear.", avatar: "P" },
  { name: "Rohit Iyer", role: "Self-taught Trader, Pune", quote: "Paper-traded NIFTY for 90 days before going live. Best onboarding to Indian markets I've seen.", avatar: "R" },
];

export const pricing = [
  { name: "Starter", price: 0, period: "forever", features: ["3 courses", "Basic AI tutor", "Community access", "Daily quizzes"], cta: "Start free" },
  { name: "Pro", price: 499, period: "month", popular: true, features: ["All courses", "Unlimited AI tutor", "Advanced screener", "Paper trading", "XP boosts"], cta: "Go Pro" },
  { name: "Lifetime", price: 9999, period: "once", features: ["Everything in Pro", "Lifetime updates", "1:1 mentor calls", "Early features", "Private Telegram"], cta: "Buy lifetime" },
];

export const courses = [
  { id: 1, title: "Candlestick Foundations", cat: "Technical", level: "Beginner", lessons: 24, progress: 72, color: "from-emerald-500 to-cyan-500" },
  { id: 2, title: "Fundamental Analysis 101", cat: "Fundamental", level: "Beginner", lessons: 18, progress: 45, color: "from-cyan-500 to-blue-500" },
  { id: 3, title: "Reading Indian Financial Statements", cat: "Fundamental", level: "Intermediate", lessons: 32, progress: 12, color: "from-blue-500 to-violet-500" },
  { id: 4, title: "F&O — Futures & Options", cat: "Advanced", level: "Advanced", lessons: 40, progress: 0, color: "from-violet-500 to-pink-500" },
  { id: 5, title: "Portfolio Construction", cat: "Strategy", level: "Intermediate", lessons: 22, progress: 88, color: "from-emerald-500 to-teal-500" },
  { id: 6, title: "Risk & Position Sizing", cat: "Strategy", level: "Intermediate", lessons: 16, progress: 30, color: "from-amber-500 to-rose-500" },
];

export const lessons = [
  { id: 1, title: "What is a Doji?", duration: "6 min", xp: 40 },
  { id: 2, title: "P/E Ratio explained", duration: "8 min", xp: 50 },
  { id: 3, title: "Support & Resistance on NIFTY", duration: "12 min", xp: 80 },
  { id: 4, title: "Reading a Balance Sheet (TCS case)", duration: "15 min", xp: 100 },
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

// Indian (NSE) stocks. Price in INR. mcap in "L Cr" = lakh crore (1 L Cr = ₹1,00,000 Cr).
export const stocks: Stock[] = [
  { ticker: "RELIANCE",   name: "Reliance Industries",       price: 2945.50,  change:  1.24, sector: "Conglomerate",   mcap: "19.9L Cr", pe: 28.4, volume: "12.8M" },
  { ticker: "TCS",        name: "Tata Consultancy Services", price: 4112.20,  change:  0.62, sector: "IT",             mcap: "14.9L Cr", pe: 31.2, volume: "4.1M"  },
  { ticker: "HDFCBANK",   name: "HDFC Bank",                 price: 1684.10,  change: -0.45, sector: "Banking",        mcap: "12.8L Cr", pe: 19.2, volume: "11.4M" },
  { ticker: "BHARTIARTL", name: "Bharti Airtel",             price: 1612.90,  change:  1.42, sector: "Telecom",        mcap:  "9.6L Cr", pe: 71.5, volume: "6.4M"  },
  { ticker: "ICICIBANK",  name: "ICICI Bank",                price: 1287.55,  change:  0.88, sector: "Banking",        mcap:  "9.1L Cr", pe: 18.6, volume: "14.2M" },
  { ticker: "INFY",       name: "Infosys",                   price: 1876.40,  change:  2.04, sector: "IT",             mcap:  "7.8L Cr", pe: 28.7, volume: "8.6M"  },
  { ticker: "SBIN",       name: "State Bank of India",       price:  824.30,  change:  1.05, sector: "Banking",        mcap:  "7.3L Cr", pe: 12.4, volume: "16.7M" },
  { ticker: "ITC",        name: "ITC Limited",               price:  478.25,  change: -1.32, sector: "FMCG",           mcap:  "5.9L Cr", pe: 26.8, volume: "18.3M" },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever",        price: 2487.20,  change: -0.21, sector: "FMCG",           mcap:  "5.8L Cr", pe: 56.4, volume: "2.8M"  },
  { ticker: "LT",         name: "Larsen & Toubro",           price: 3678.55,  change:  0.78, sector: "Infrastructure", mcap:  "5.1L Cr", pe: 35.6, volume: "3.9M"  },
  { ticker: "SUNPHARMA",  name: "Sun Pharmaceutical",        price: 1742.10,  change:  1.05, sector: "Pharma",         mcap:  "4.2L Cr", pe: 38.2, volume: "5.7M"  },
  { ticker: "MARUTI",     name: "Maruti Suzuki",             price: 11245.30, change: -0.92, sector: "Auto",           mcap:  "3.5L Cr", pe: 27.4, volume: "1.6M"  },
  { ticker: "TATAMOTORS", name: "Tata Motors",               price:  932.65,  change: -2.11, sector: "Auto",           mcap:  "3.4L Cr", pe: 11.2, volume: "22.6M" },
  { ticker: "ADANIENT",   name: "Adani Enterprises",         price: 2756.80,  change:  3.92, sector: "Conglomerate",   mcap:  "3.2L Cr", pe: 65.4, volume: "9.8M"  },
  { ticker: "WIPRO",      name: "Wipro",                     price:  564.40,  change:  1.87, sector: "IT",             mcap:  "2.9L Cr", pe: 24.2, volume: "14.8M" },
  { ticker: "TATASTEEL",  name: "Tata Steel",                price:  142.80,  change:  4.31, sector: "Metals",         mcap:  "1.8L Cr", pe: 18.6, volume: "65.3M" },
];

export const sectors = ["All", "IT", "Banking", "Conglomerate", "FMCG", "Auto", "Pharma", "Telecom", "Infrastructure", "Metals"];

// Indian indices for hero/landing widgets
export const indices = [
  { name: "NIFTY 50",   value: 24812.65, change:  0.84 },
  { name: "SENSEX",     value: 81284.30, change:  0.72 },
  { name: "BANK NIFTY", value: 52640.10, change:  1.12 },
  { name: "NIFTY IT",   value: 42115.55, change:  1.46 },
  { name: "NIFTY MIDCAP", value: 58921.20, change:  0.55 },
];

export const quizzes = [
  { q: "Which candlestick pattern signals indecision in the market?", a: ["Hammer", "Doji", "Engulfing", "Marubozu"], correct: 1 },
  { q: "P/E ratio is calculated as:", a: ["Price / Earnings", "Profit / Equity", "Price × Earnings", "Earnings / Price"], correct: 0 },
  { q: "What does 'support' mean in technical analysis?", a: ["Resistance level", "Price floor where buyers step in", "Trend reversal", "Dividend payout"], correct: 1 },
  { q: "Which Indian regulator oversees the stock market?", a: ["RBI", "SEBI", "IRDAI", "NSE"], correct: 1 },
  { q: "1 lakh crore equals how many crore?", a: ["10,000", "1,00,000", "10,00,000", "1,000"], correct: 1 },
];

export const activity = [
  { who: "You", what: "completed lesson 'Doji & Spinning Top'", when: "2m ago" },
  { who: "AI Tutor", what: "generated a summary of Reliance Q2 results", when: "1h ago" },
  { who: "You", what: "earned 80 XP on Support & Resistance quiz", when: "3h ago" },
  { who: "Streak", what: "reached 42 days 🔥", when: "today" },
];

export const referralLeaders = [
  { rank: 1, name: "Priya Shah",   refs: 142, earned: 28400 },
  { rank: 2, name: "Rohit Iyer",   refs: 118, earned: 23600 },
  { rank: 3, name: "Aarav Mehta",  refs:  96, earned: 19200 },
  { rank: 4, name: "You",          refs:  28, earned:  5600 },
  { rank: 5, name: "Sara Nair",    refs:  22, earned:  4400 },
];

export const referralChart = [
  { m: "Jan", clicks: 120, signups: 18 },
  { m: "Feb", clicks: 200, signups: 32 },
  { m: "Mar", clicks: 260, signups: 41 },
  { m: "Apr", clicks: 320, signups: 58 },
  { m: "May", clicks: 410, signups: 76 },
  { m: "Jun", clicks: 520, signups: 102 },
];

// Revenue in INR (₹). Roughly 10L–50L per month.
export const adminRevenue = [
  { m: "Jan", revenue: 1240000, users: 820 },
  { m: "Feb", revenue: 1820000, users: 1240 },
  { m: "Mar", revenue: 2480000, users: 1860 },
  { m: "Apr", revenue: 3210000, users: 2420 },
  { m: "May", revenue: 4120000, users: 3180 },
  { m: "Jun", revenue: 5260000, users: 4020 },
  { m: "Jul", revenue: 6490000, users: 4880 },
];

export const adminCoursePerf = [
  { name: "Candlesticks", completion: 78 },
  { name: "Fundamentals", completion: 64 },
  { name: "F&O",          completion: 41 },
  { name: "Portfolio",    completion: 72 },
  { name: "Risk",         completion: 55 },
];

export const adminStudents = [
  { name: "Aarav Mehta",   email: "aarav@candlemind.in",  joined: "2025-09-12", course: "Candlesticks",  status: "Active" },
  { name: "Priya Shah",    email: "priya@candlemind.in",  joined: "2025-08-03", course: "Fundamentals",  status: "Active" },
  { name: "Rohit Iyer",    email: "rohit@candlemind.in",  joined: "2025-07-21", course: "F&O",           status: "Active" },
  { name: "Sara Nair",     email: "sara@candlemind.in",   joined: "2025-10-01", course: "Portfolio",     status: "Trial"  },
  { name: "Ravi Krishnan", email: "ravi@candlemind.in",   joined: "2025-06-18", course: "Risk",          status: "Active" },
  { name: "Maya Reddy",    email: "maya@candlemind.in",   joined: "2025-11-04", course: "Candlesticks",  status: "Trial"  },
];
