
-- Brokers catalog
CREATE TABLE public.brokers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  brokerage text NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 4.0,
  badges text[] NOT NULL DEFAULT '{}',
  referral_url text NOT NULL,
  best_for text,
  min_deposit text,
  account_opening_time text,
  supports_intraday boolean NOT NULL DEFAULT true,
  supports_delivery boolean NOT NULL DEFAULT true,
  supports_options boolean NOT NULL DEFAULT true,
  supports_margin boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active brokers" ON public.brokers
  FOR SELECT USING (active = true);

CREATE POLICY "Admins view all brokers" ON public.brokers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage brokers" ON public.brokers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_brokers_updated_at
  BEFORE UPDATE ON public.brokers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Referral clicks
CREATE TABLE public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  user_id uuid,
  session_id text,
  referrer text,
  user_agent text,
  device text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referral_clicks_broker ON public.referral_clicks(broker_id);
CREATE INDEX idx_referral_clicks_created ON public.referral_clicks(created_at DESC);
CREATE INDEX idx_referral_clicks_user ON public.referral_clicks(user_id);

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anon) can insert a click record
CREATE POLICY "Anyone can record clicks" ON public.referral_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all clicks" ON public.referral_clicks
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users view own clicks" ON public.referral_clicks
  FOR SELECT USING (auth.uid() = user_id);

-- Referral conversions
CREATE TABLE public.referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  reported_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversions_broker ON public.referral_conversions(broker_id);
CREATE INDEX idx_conversions_user ON public.referral_conversions(user_id);

ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own conversions" ON public.referral_conversions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all conversions" ON public.referral_conversions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed brokers
INSERT INTO public.brokers (slug, name, logo_url, description, features, brokerage, rating, badges, referral_url, best_for, min_deposit, account_opening_time, supports_intraday, supports_delivery, supports_options, supports_margin, display_order) VALUES
('zerodha', 'Zerodha', 'https://logo.clearbit.com/zerodha.com', 'India''s largest discount broker. Trusted by over 1.6 Cr+ active traders for low brokerage and the Kite trading platform.', ARRAY['Kite platform','Free equity delivery','Varsity learning','Console portfolio tracker'], '₹0 delivery, ₹20 intraday', 4.7, ARRAY['Most Trusted','Best for Beginners'], 'https://zerodha.com/open-account?c=', 'Long-term investors', '₹0', '24 hrs', true, true, true, true, 1),
('groww', 'Groww', 'https://logo.clearbit.com/groww.in', 'Beginner-friendly investing app with simple UI. Trade stocks, mutual funds, IPOs, US stocks and SIPs in one place.', ARRAY['Simple UI','Mutual funds & SIP','US stocks','IPO investing'], '₹20 / trade', 4.6, ARRAY['Best for Beginners'], 'https://groww.in/open-demat-account', 'New investors', '₹0', '24 hrs', true, true, true, false, 2),
('upstox', 'Upstox', 'https://logo.clearbit.com/upstox.com', 'Backed by Ratan Tata. Pro-grade trading platform with low brokerage, fast order execution and advanced charting.', ARRAY['Pro trader tools','Free demat','Margin trading','TradingView charts'], '₹20 / trade', 4.5, ARRAY['Low Cost'], 'https://upstox.com/open-demat-account/', 'Active traders', '₹0', '24 hrs', true, true, true, true, 3),
('angel-one', 'Angel One', 'https://logo.clearbit.com/angelone.in', 'Full-service broker with AI-powered research (ARQ Prime), Smart API and 40+ years of market presence.', ARRAY['Research reports','ARQ Prime AI','Smart API','Free account opening'], '₹0 delivery, ₹20 intraday', 4.4, ARRAY['Full Service'], 'https://www.angelone.in/open-demat-account', 'Research-driven traders', '₹0', '24 hrs', true, true, true, true, 4),
('icici-direct', 'ICICI Direct', 'https://logo.clearbit.com/icicidirect.com', 'Bank-backed 3-in-1 demat from ICICI Bank with integrated savings, demat and trading account.', ARRAY['3-in-1 account','Research & advisory','IPO & MF','Margin funding'], '₹0 delivery (Neo Plan)', 4.3, ARRAY['Bank Backed'], 'https://www.icicidirect.com/openaccount', 'Bank account holders', '₹0', '24-48 hrs', true, true, true, true, 5),
('hdfc-sky', 'HDFC Sky', 'https://logo.clearbit.com/hdfcsec.com', 'Modern trading app from HDFC Securities with flat ₹20/trade brokerage and lifetime free AMC option.', ARRAY['Flat ₹20/trade','Lifetime free AMC','Advanced charts','MF & IPO'], '₹20 / trade', 4.3, ARRAY['Bank Backed'], 'https://hdfcsky.com/open-demat-account', 'HDFC customers', '₹0', '24 hrs', true, true, true, true, 6),
('5paisa', '5paisa', 'https://logo.clearbit.com/5paisa.com', 'Discount broker offering ultra-low ₹20/trade across all segments with research and robo-advisory tools.', ARRAY['Robo advisor','Research reports','Mutual funds','Insurance'], '₹20 / trade', 4.2, ARRAY['Low Cost'], 'https://www.5paisa.com/open-demat-account', 'Cost-conscious traders', '₹0', '24 hrs', true, true, true, false, 7),
('kotak-securities', 'Kotak Securities', 'https://logo.clearbit.com/kotaksecurities.com', 'Trusted bank-backed broker. Free intraday trading for users under 30 and zero brokerage for delivery on Trade Free Plan.', ARRAY['Free intraday (under 30)','Trade Free Plan','Research','MF & IPO'], '₹0 delivery (Trade Free)', 4.4, ARRAY['Bank Backed'], 'https://www.kotaksecurities.com/account/open-an-account/', 'Young traders', '₹0', '24-48 hrs', true, true, true, true, 8),
('motilal-oswal', 'Motilal Oswal', 'https://logo.clearbit.com/motilaloswal.com', 'Full-service broker known for deep research, advisory and the "Buy Right, Sit Tight" investing philosophy.', ARRAY['Research advisory','PMS & AIF','MF & IPO','Branch support'], '0.20% delivery', 4.2, ARRAY['Full Service'], 'https://www.motilaloswal.com/open-demat-account', 'Long-term investors', '₹0', '24-48 hrs', true, true, true, true, 9),
('dhan', 'Dhan', 'https://logo.clearbit.com/dhan.co', 'Trader-first platform with built-in TradingView, options strategy builder and zero brokerage on equity delivery.', ARRAY['Options strategy builder','TradingView built-in','Forever free delivery','Super fast orders'], '₹0 delivery, ₹20 F&O', 4.6, ARRAY['Trader Focused'], 'https://dhan.co/open-demat-account/', 'F&O traders', '₹0', '24 hrs', true, true, true, true, 10),
('fyers', 'Fyers', 'https://logo.clearbit.com/fyers.in', 'Discount broker built for technical traders. Free thematic investing, advanced charting and Fyers API for algo trading.', ARRAY['Advanced charts','Fyers API (algo)','Thematic investing','Free delivery'], '₹0 delivery, ₹20 intraday', 4.4, ARRAY['Algo Trading'], 'https://signup.fyers.in/', 'Algo traders', '₹0', '24 hrs', true, true, true, false, 11),
('paytm-money', 'Paytm Money', 'https://logo.clearbit.com/paytmmoney.com', 'Mobile-first investing app from Paytm with low-cost stock trading, MFs, NPS and IPOs.', ARRAY['Mobile-first','MF & NPS','IPO investing','Low brokerage'], '₹20 / trade', 4.1, ARRAY['Mobile First'], 'https://www.paytmmoney.com/stocks/open-demat-account', 'Mobile users', '₹0', '24 hrs', true, true, true, false, 12),
('sharekhan', 'Sharekhan', 'https://logo.clearbit.com/sharekhan.com', 'One of India''s oldest full-service brokers (now BNP Paribas) with strong research and 1,400+ branches.', ARRAY['Deep research','Branch support','PMS','Tradetiger desktop'], '0.30% delivery', 4.1, ARRAY['Full Service'], 'https://www.sharekhan.com/open-an-account', 'Research-led investors', '₹0', '48 hrs', true, true, true, true, 13),
('alice-blue', 'Alice Blue', 'https://logo.clearbit.com/aliceblueonline.com', 'Discount broker with ANT trading apps, free API access for algo traders and aggressive margin offerings.', ARRAY['Free API access','ANT Web/Mobile','High margins','Free MF'], '₹15 / trade', 4.0, ARRAY['Algo Trading'], 'https://aliceblueonline.com/open-account/', 'Algo & high-margin traders', '₹0', '24 hrs', true, true, true, true, 14),
('samco', 'Samco', 'https://logo.clearbit.com/samco.in', 'Flat ₹20/trade discount broker with StockNote app, options strategy tools and 4x intraday leverage.', ARRAY['StockNote app','Options tools','4x intraday','MF investing'], '₹20 / trade', 4.0, ARRAY['Low Cost'], 'https://www.samco.in/open-an-account', 'Intraday traders', '₹0', '24 hrs', true, true, true, true, 15),
('axis-direct', 'Axis Direct', 'https://logo.clearbit.com/axisdirect.in', 'Bank-backed 3-in-1 demat from Axis Bank with research, advisory and integrated banking.', ARRAY['3-in-1 account','Research','MF & IPO','Margin trading'], '₹20 / trade (Neo)', 4.2, ARRAY['Bank Backed'], 'https://simplehai.axisdirect.in/open-an-account', 'Axis Bank customers', '₹0', '24-48 hrs', true, true, true, true, 16);
