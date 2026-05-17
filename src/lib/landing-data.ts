export const news = [
  { tag: "Markets", title: "Nifty hits fresh all-time high as IT stocks rally", source: "MoneyControl", time: "12m ago", change: "+1.4%" },
  { tag: "Earnings", title: "NVIDIA beats Q3 estimates, AI revenue tops $30B", source: "Bloomberg", time: "1h ago", change: "+3.2%" },
  { tag: "Economy", title: "RBI keeps repo rate unchanged, signals dovish tilt", source: "Economic Times", time: "2h ago", change: "—" },
  { tag: "Startups", title: "Zepto raises $500M at $5B valuation in fresh round", source: "TechCrunch", time: "4h ago", change: "—" },
  { tag: "Company", title: "Tata Motors splits into two listed entities", source: "Reuters", time: "6h ago", change: "+2.1%" },
  { tag: "Crypto", title: "Bitcoin reclaims $100K as ETF inflows accelerate", source: "CoinDesk", time: "8h ago", change: "+4.8%" },
];

export const demat = [
  { name: "Zerodha", tag: "Most trusted", brokerage: "₹20 / trade", features: ["Kite platform", "Free equity delivery", "0 AMC first year"], color: "from-blue-500 to-cyan-500", initial: "Z" },
  { name: "Groww", tag: "Beginner friendly", brokerage: "₹20 / trade", features: ["Simple UI", "Mutual funds", "US stocks"], color: "from-emerald-500 to-teal-500", initial: "G" },
  { name: "Upstox", tag: "Low cost", brokerage: "₹20 / trade", features: ["Pro trader tools", "Free demat", "Margin trading"], color: "from-violet-500 to-fuchsia-500", initial: "U" },
  { name: "Angel One", tag: "Full service", brokerage: "₹20 / trade", features: ["Research reports", "ARQ Prime AI", "Smart API"], color: "from-orange-500 to-rose-500", initial: "A" },
  { name: "Dhan", tag: "Trader focused", brokerage: "₹20 / trade", features: ["Options strategy", "TradingView built-in", "Forever free"], color: "from-amber-500 to-yellow-500", initial: "D" },
];

export const roadmap = [
  { level: "Beginner", color: "from-emerald-400 to-cyan-400", steps: ["What is a stock?", "Reading candlesticks", "Demat & broker basics", "Your first paper trade"] },
  { level: "Intermediate", color: "from-cyan-400 to-blue-500", steps: ["Technical indicators", "P/E, ROE, ROCE", "Sector rotation", "Risk management"] },
  { level: "Advanced", color: "from-violet-500 to-fuchsia-500", steps: ["Options strategies", "Derivatives & futures", "Algo basics", "Portfolio construction"] },
];

export const screenerPreview = [
  { title: "Top Gainers", items: [["TATAMOTORS", "+5.4%"], ["INFY", "+4.8%"], ["RELIANCE", "+3.9%"]], tone: "success" },
  { title: "Top Losers", items: [["HDFC", "-2.1%"], ["WIPRO", "-1.8%"], ["ITC", "-1.4%"]], tone: "destructive" },
  { title: "Low PE Stocks", items: [["COALINDIA", "PE 7.2"], ["ONGC", "PE 8.1"], ["NTPC", "PE 11.4"]], tone: "primary" },
  { title: "High Growth", items: [["ADANIENT", "+38%"], ["ZOMATO", "+62%"], ["POLYCAB", "+44%"]], tone: "accent" },
];
