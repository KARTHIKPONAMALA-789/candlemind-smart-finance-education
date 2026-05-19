import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Star, Check, Shield, Clock, IndianRupee } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getBrokerBySlug, trackBrokerClick, type Broker } from "@/lib/brokers.functions";
import { useAuth } from "@/hooks/use-auth";
import { BrokerLogo } from "@/components/site/BrokerLogo";

export const Route = createFileRoute("/demat/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Open ${cap(params.slug)} Demat Account | CandleMinds` },
      {
        name: "description",
        content: `Open a demat account with ${cap(params.slug)}. Compare brokerage, features and ratings on CandleMinds.`,
      },
      { property: "og:title", content: `Open ${cap(params.slug)} Demat Account | CandleMinds` },
      { property: "og:url", content: `https://candle-minds-market.lovable.app/demat/${params.slug}` },
    ],
    links: [
      { rel: "canonical", href: `https://candle-minds-market.lovable.app/demat/${params.slug}` },
    ],
  }),
  component: BrokerDetail,
});

function cap(s: string) {
  return s
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function BrokerDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const fetchBroker = useServerFn(getBrokerBySlug);
  const trackFn = useServerFn(trackBrokerClick);
  const { data, isLoading } = useQuery({
    queryKey: ["broker", slug],
    queryFn: () => fetchBroker({ data: { slug } }),
  });

  const b: Broker | null = data?.broker ?? null;

  const handleOpen = async () => {
    if (!b) return;
    const win = window.open(b.referral_url, "_blank", "noopener,noreferrer");
    try {
      await trackFn({ data: { slug: b.slug, userId: user?.id ?? null } });
    } catch {}
    if (!win) window.location.href = b.referral_url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
        <Link to="/demat" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-3" /> All brokers
        </Link>

        {isLoading && <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</div>}

        {!isLoading && !b && (
          <div className="glass rounded-2xl p-10 text-center">
            <h2 className="font-display text-xl font-semibold">Broker not found</h2>
            <Link to="/demat" className="text-sm text-primary mt-2 inline-block">Back to marketplace</Link>
          </div>
        )}

        {b && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 group">
              <BrokerLogo
                name={b.name}
                logoUrl={b.logo_url}
                size="lg"
                trusted={b.badges.some((x) => /trusted|verified|official/i.test(x))}
              />

              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl md:text-3xl font-semibold">{b.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="size-3 fill-primary text-primary" /> {b.rating.toFixed(1)}</span>
                  {b.best_for && <span>Best for {b.best_for}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {b.badges.map((bd) => (
                    <span key={bd} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {bd}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{b.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              <Metric icon={IndianRupee} label="Brokerage" value={b.brokerage} />
              <Metric icon={Clock} label="Opens in" value={b.account_opening_time ?? "24 hrs"} />
              <Metric icon={Shield} label="Min deposit" value={b.min_deposit ?? "₹0"} />
            </div>

            <div className="mt-6">
              <h3 className="font-display font-semibold text-sm mb-2">Key features</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {b.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <Cap label="Intraday" on={b.supports_intraday} />
              <Cap label="Delivery" on={b.supports_delivery} />
              <Cap label="F&O" on={b.supports_options} />
              <Cap label="Margin" on={b.supports_margin} />
            </div>

            <button
              onClick={handleOpen}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
            >
              Open {b.name} Account <ExternalLink className="size-4" />
            </button>
            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              You'll be redirected to {new URL(b.referral_url).hostname} — CandleMinds is an official partner.
            </p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <Icon className="size-3.5" />
      </div>
      <div className="mt-1 font-medium text-sm">{value}</div>
    </div>
  );
}

function Cap({ label, on }: { label: string; on: boolean }) {
  return (
    <div className={`glass rounded-lg px-3 py-2 flex items-center justify-between ${on ? "text-foreground" : "text-muted-foreground/60"}`}>
      <span>{label}</span>
      <span className={on ? "text-primary" : "text-muted-foreground"}>{on ? "✓" : "—"}</span>
    </div>
  );
}
