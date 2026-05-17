## Demat Referral & Partner System

Build a complete broker marketplace + referral tracking system into CandleMinds without altering existing pages.

### 1. Database (migration)

New tables:
- **`brokers`** — id, slug, name, logo_url, description, features (text[]), brokerage, rating (numeric), badges (text[]), referral_url, category tags (text[]), best_for, account_opening_time, min_deposit, supports_intraday/delivery/options/margin (booleans), display_order, active. Public read; admin write via `has_role(admin)`.
- **`referral_clicks`** — id, broker_id, user_id (nullable), session_id, referrer, user_agent, device, ip_hash, created_at. Insert open to anyone (anonymous tracking allowed); select admin-only.
- **`referral_conversions`** — id, broker_id, user_id, status (`pending|signed_up|funded`), reported_at, notes. User can insert/view own; admin views all.

Seed the 16 listed Indian brokers with official affiliate/referral landing URLs.

### 2. Server functions (`src/lib/brokers.functions.ts`)
- `listBrokers({ filters })` — public, ranked by display_order.
- `trackBrokerClick({ brokerSlug })` — inserts a click row (uses `requireSupabaseAuth` optionally; works anonymously via admin client with rate-limit by ip_hash + slug, 1/min).
- `selfReportConversion({ brokerSlug })` — authed; lets a user mark "I opened an account".
- `getBrokerAnalytics()` — admin-only via `has_role`; returns totals, per-broker counts, daily series (last 30/90 days), top broker, CTR, conversions.

### 3. New routes
- **`/demat`** — public marketplace page. Filter sidebar (brokerage, intraday, delivery, options, margin, best-for). Responsive broker grid using existing glass card styling. Each card: logo, name, rating, badges ("Trusted", "Best for Beginners"), key features, brokerage, "Open Account →" CTA. CTA calls `trackBrokerClick` then opens referral URL in new tab with `rel="noopener nofollow sponsored"` and an "external redirect" tooltip. Also: comparison table toggle (select up to 3 brokers).
- **`/demat/$slug`** — broker detail page with full description, features, ratings, SEO meta tags.
- **`/admin-dashboard/referrals`** (or section inside existing admin dashboard) — analytics: KPI tiles (total clicks, unique users, top broker, conversion rate), Recharts area chart (clicks over time), bar chart (clicks per broker), table of recent clicks. Guarded by RoleGuard `["admin"]`.

### 4. Navbar
Add "Demat" link between Screener and Live Chart. No other UI changes.

### 5. Performance & SEO
- Lazy-load broker logos (`loading="lazy"`, `decoding="async"`).
- Each broker route sets `head()` title + meta + og tags + JSON-LD `FinancialProduct`.
- Cards use existing tokens (glass, gradient-primary) — no theme changes.

### 6. Security
- Only official broker domains in `referral_url` (validated at insert).
- Click endpoint rate-limited (1 insert per ip_hash+broker per 60s) to deter abuse.
- Admin analytics protected by `has_role(admin)` in both RLS and server fn.
- Outbound links use `rel="noopener noreferrer nofollow sponsored"` and visible "You're leaving CandleMinds" label.

### Technical notes
- Logo URLs use Clearbit logo CDN (`https://logo.clearbit.com/zerodha.com` etc.) — no asset uploads required, automatically optimized.
- Click tracking uses `supabaseAdmin` server-side so anonymous visitors are countable without auth.
- Filters computed client-side from the full broker list (small dataset, ~16 rows).
- No changes to existing routes, dashboards, or styles besides one Navbar link.

Ready to implement?
