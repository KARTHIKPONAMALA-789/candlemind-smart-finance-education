import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Star, ExternalLink, Search, Shield, Sparkles, Check, X, Filter } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { listBrokers, trackBrokerClick, type Broker } from "@/lib/brokers.functions";
import { useAuth } from "@/hooks/use-auth";
import { BrokerLogo } from "@/components/site/BrokerLogo";

export const Route = createFileRoute("/demat")({
  head: () => ({
    meta: [
      { title: "Open a Demat Account — Compare India's Top Brokers | CandleMinds" },
      {
        name: "description",
        content:
          "Compare Zerodha, Groww, Upstox, Angel One, ICICI Direct and more. Open a demat account with India's most trusted stock brokers in minutes.",
      },
      { property: "og:title", content: "Open a Demat Account — CandleMinds" },
      { property: "og:description", content: "Compare India's top demat brokers and open an account in minutes." },
      { property: "og:url", content: "https://candle-minds-market.lovable.app/demat" },
    ],
    links: [{ rel: "canonical", href: "https://candle-minds-market.lovable.app/demat" }],
  }),
  component: DematMarketplace,
});

type Filters = {
  q: string;
  intraday: boolean;
  delivery: boolean;
  options: boolean;
  margin: boolean;
};

function DematMarketplace() {
  const { user } = useAuth();
  const trackFn = useServerFn(trackBrokerClick);
  const { data } = useQuery({ queryKey: ["brokers"], queryFn: () => listBrokers() });
  const brokers: Broker[] = data?.brokers ?? [];

  const [filters, setFilters] = useState<Filters>({
    q: "",
    intraday: false,
    delivery: false,
    options: false,
    margin: false,
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return brokers.filter((b) => {
      if (q && !`${b.name} ${b.best_for ?? ""} ${b.badges.join(" ")}`.toLowerCase().includes(q)) return false;
      if (filters.intraday && !b.supports_intraday) return false;
      if (filters.delivery && !b.supports_delivery) return false;
      if (filters.options && !b.supports_options) return false;
      if (filters.margin && !b.supports_margin) return false;
      return true;
    });
  }, [brokers, filters]);

  const compared = brokers.filter((b) => compareIds.includes(b.id));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  };

  const handleOpen = async (b: Broker) => {
    // Open immediately on user gesture, then fire-and-forget tracking.
    const win = window.open(b.referral_url, "_blank", "noopener,noreferrer");
    try {
      await trackFn({ data: { slug: b.slug, userId: user?.id ?? null } });
    } catch {
      /* swallow — link already opened */
    }
    if (!win) window.location.href = b.referral_url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-primary mb-4">
            <Shield className="size-3" /> Official broker partners
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Open a <span className="gradient-text">Demat Account</span> with India's most trusted brokers
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Compare brokerage, features and ratings. Account opening is 100% free and takes about 24 hours.
          </p>
        </motion.div>

        {/* Search + filters */}
        <div className="glass-strong rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 min-w-[200px]">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search brokers..."
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Filter className="size-3.5 text-muted-foreground" />
            {([
              ["intraday", "Intraday"],
              ["delivery", "Delivery"],
              ["options", "F&O"],
              ["margin", "Margin"],
            ] as const).map(([key, label]) => {
              const on = filters[key];
              return (
                <button
                  key={key}
                  onClick={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    on
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compare bar */}
        {compared.length > 0 && (
          <div className="mb-6 overflow-x-auto glass-strong rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold">Comparing {compared.length} broker{compared.length > 1 ? "s" : ""}</h3>
              <button onClick={() => setCompareIds([])} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
            <table className="w-full text-xs min-w-[600px]">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Broker</th>
                  <th className="text-left">Brokerage</th>
                  <th className="text-left">Rating</th>
                  <th className="text-left">Best for</th>
                  <th className="text-center">Intraday</th>
                  <th className="text-center">F&O</th>
                  <th className="text-center">Margin</th>
                </tr>
              </thead>
              <tbody>
                {compared.map((b) => (
                  <tr key={b.id} className="border-t border-border/50">
                    <td className="py-2 font-medium">{b.name}</td>
                    <td>{b.brokerage}</td>
                    <td>{b.rating.toFixed(1)} ★</td>
                    <td>{b.best_for}</td>
                    <td className="text-center">{b.supports_intraday ? <Check className="size-3.5 inline text-primary" /> : <X className="size-3.5 inline text-muted-foreground" />}</td>
                    <td className="text-center">{b.supports_options ? <Check className="size-3.5 inline text-primary" /> : <X className="size-3.5 inline text-muted-foreground" />}</td>
                    <td className="text-center">{b.supports_margin ? <Check className="size-3.5 inline text-primary" /> : <X className="size-3.5 inline text-muted-foreground" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-5 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-[image:var(--gradient-primary)] opacity-0 group-hover:opacity-10 blur-3xl transition" />
              <div className="flex items-start gap-3 relative">
                <BrokerLogo
                  name={b.name}
                  logoUrl={b.logo_url}
                  size="md"
                  trusted={b.badges.some((x) => /trusted|verified|official/i.test(x))}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold truncate">{b.name}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Star className="size-3 fill-primary text-primary" /> {b.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {b.badges.slice(0, 2).map((bd) => (
                      <span key={bd} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {bd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{b.description}</p>

              <ul className="mt-3 space-y-1">
                {b.features.slice(0, 3).map((f) => (
                  <li key={f} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                    <Check className="size-3 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <div>
                  <div className="text-muted-foreground">Brokerage</div>
                  <div className="font-medium">{b.brokerage}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">Opens in</div>
                  <div className="font-medium">{b.account_opening_time ?? "24 hrs"}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleOpen(b)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
                  title={`You'll be redirected to ${new URL(b.referral_url).hostname}`}
                >
                  Open Account <ExternalLink className="size-3.5" />
                </button>
                <Link
                  to="/demat/$slug"
                  params={{ slug: b.slug }}
                  className="glass rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition"
                >
                  Details
                </Link>
                <button
                  onClick={() => toggleCompare(b.id)}
                  className={`glass rounded-lg px-2 py-2 text-xs transition ${
                    compareIds.includes(b.id) ? "text-primary border-primary/40" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Compare"
                  aria-pressed={compareIds.includes(b.id)}
                >
                  ⇄
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-2.5" /> Official partner link · external redirect
              </p>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No brokers match those filters.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
