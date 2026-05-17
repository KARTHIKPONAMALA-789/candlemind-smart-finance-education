export const news = [
  { tag: "Indian Stock Market", title: "NIFTY 50 hits fresh all-time high as IT stocks rally on TCS earnings",        source: "MoneyControl",   time: "12m ago", change: "+1.4%" },
  { tag: "RBI News",             title: "RBI keeps repo rate unchanged at 6.5%, signals dovish tilt for FY26",          source: "Economic Times", time: "1h ago",  change: "—"     },
  { tag: "IPO News",             title: "Swiggy IPO subscribed 3.6x on final day, listing expected next week",          source: "Mint",           time: "2h ago",  change: "+8.2%" },
  { tag: "Startup India",        title: "Zepto raises ₹4,150 Cr at ₹40,000 Cr valuation in fresh round",                source: "YourStory",      time: "4h ago",  change: "—"     },
  { tag: "NSE/BSE Updates",      title: "Tata Motors splits into two listed entities — record date announced",          source: "Reuters India",  time: "6h ago",  change: "+2.1%" },
  { tag: "Indian Economy",       title: "India Q2 GDP growth comes in at 6.7%, manufacturing leads recovery",           source: "Bloomberg Quint",time: "8h ago",  change: "—"     },
];

export const demat = [
  { name: "Zerodha",   tag: "Most trusted",      brokerage: "₹20 / trade", features: ["Kite platform", "Free equity delivery", "Varsity learning"],   color: "from-blue-500 to-cyan-500",   initial: "Z" },
  { name: "Groww",     tag: "Beginner friendly", brokerage: "₹20 / trade", features: ["Simple UI", "Mutual funds & SIP", "US stocks"],                color: "from-emerald-500 to-teal-500",initial: "G" },
  { name: "Upstox",    tag: "Low cost",          brokerage: "₹20 / trade", features: ["Pro trader tools", "Free demat", "Margin trading"],            color: "from-violet-500 to-fuchsia-500",initial: "U" },
  { name: "Angel One", tag: "Full service",      brokerage: "₹20 / trade", features: ["Research reports", "ARQ Prime AI", "Smart API"],               color: "from-orange-500 to-rose-500", initial: "A" },
  { name: "Dhan",      tag: "Trader focused",    brokerage: "₹20 / trade", features: ["Options strategy builder", "TradingView built-in", "Forever free"], color: "from-amber-500 to-yellow-500", initial: "D" },
];

export const roadmap = [
  { level: "Beginner",     color: "from-emerald-400 to-cyan-400",   steps: ["What is a stock?", "Reading candlesticks", "Demat & broker basics", "Your first paper trade"] },
  { level: "Intermediate", color: "from-cyan-400 to-blue-500",      steps: ["Technical indicators", "P/E, ROE, ROCE", "Sector rotation", "Risk management"] },
  { level: "Advanced",     color: "from-violet-500 to-fuchsia-500", steps: ["F&O strategies", "Derivatives & futures", "Algo basics", "Portfolio construction"] },
];

export const screenerPreview = [
  { title: "Top Gainers",    items: [["TATASTEEL", "+4.3%"], ["ADANIENT", "+3.9%"], ["INFY", "+2.0%"]], tone: "success"     },
  { title: "Top Losers",     items: [["TATAMOTORS", "-2.1%"], ["ITC", "-1.3%"], ["MARUTI", "-0.9%"]],    tone: "destructive" },
  { title: "Low PE Stocks",  items: [["SBIN", "PE 12.4"], ["TATAMOTORS", "PE 11.2"], ["TATASTEEL", "PE 18.6"]], tone: "primary" },
  { title: "High Growth",    items: [["ADANIENT", "+38%"], ["ZOMATO", "+62%"], ["POLYCAB", "+44%"]],     tone: "accent"      },
];
