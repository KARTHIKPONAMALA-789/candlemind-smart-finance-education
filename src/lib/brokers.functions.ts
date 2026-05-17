import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Broker = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string;
  features: string[];
  brokerage: string;
  rating: number;
  badges: string[];
  referral_url: string;
  best_for: string | null;
  min_deposit: string | null;
  account_opening_time: string | null;
  supports_intraday: boolean;
  supports_delivery: boolean;
  supports_options: boolean;
  supports_margin: boolean;
};

export const listBrokers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("brokers")
    .select(
      "id,slug,name,logo_url,description,features,brokerage,rating,badges,referral_url,best_for,min_deposit,account_opening_time,supports_intraday,supports_delivery,supports_options,supports_margin"
    )
    .eq("active", true)
    .order("display_order", { ascending: true });
  if (error) return { brokers: [] as Broker[], error: error.message };
  return { brokers: (data ?? []) as Broker[], error: null };
});

export const getBrokerBySlug = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("brokers")
      .select(
        "id,slug,name,logo_url,description,features,brokerage,rating,badges,referral_url,best_for,min_deposit,account_opening_time,supports_intraday,supports_delivery,supports_options,supports_margin"
      )
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) return { broker: null as Broker | null, error: error.message };
    return { broker: (row as Broker) ?? null, error: null };
  });

function detectDevice(ua: string | null): string {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|android|iphone/.test(s)) return "mobile";
  return "desktop";
}

export const trackBrokerClick = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ slug: z.string().min(1).max(64), userId: z.string().uuid().nullable().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { data: broker } = await supabaseAdmin
      .from("brokers")
      .select("id,referral_url")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (!broker) return { ok: false as const, error: "not_found" };

    const ua = getRequestHeader("user-agent") ?? null;
    const referrer = getRequestHeader("referer") ?? null;
    const ipRaw =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;
    const ipHash = ipRaw ? createHash("sha256").update(ipRaw).digest("hex").slice(0, 32) : null;

    await supabaseAdmin.from("referral_clicks").insert({
      broker_id: broker.id,
      user_id: data.userId ?? null,
      referrer,
      user_agent: ua,
      device: detectDevice(ua),
      ip_hash: ipHash,
    });

    return { ok: true as const, referral_url: broker.referral_url };
  });

export const selfReportConversion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ slug: z.string().min(1).max(64), notes: z.string().max(500).optional() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: broker } = await supabase.from("brokers").select("id").eq("slug", data.slug).maybeSingle();
    if (!broker) return { ok: false, error: "not_found" };
    const { error } = await supabase
      .from("referral_conversions")
      .insert({ broker_id: broker.id, user_id: userId, status: "signed_up", notes: data.notes ?? null });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export type BrokerAnalytics = {
  totalClicks: number;
  uniqueUsers: number;
  totalConversions: number;
  conversionRate: number;
  topBroker: { name: string; clicks: number } | null;
  perBroker: { slug: string; name: string; clicks: number; conversions: number }[];
  daily: { date: string; clicks: number }[];
  recent: { broker: string; device: string | null; created_at: string }[];
  deviceBreakdown: { device: string; count: number }[];
  error: string | null;
};

export const getBrokerAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BrokerAnalytics> => {
    const empty: BrokerAnalytics = {
      totalClicks: 0,
      uniqueUsers: 0,
      totalConversions: 0,
      conversionRate: 0,
      topBroker: null,
      perBroker: [],
      daily: [],
      recent: [],
      deviceBreakdown: [],
      error: null,
    };

    // Authorize admin
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return { ...empty, error: "forbidden" };

    const since = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString();

    const [{ data: brokersRows }, { data: clicksRows }, { data: convRows }] = await Promise.all([
      supabaseAdmin.from("brokers").select("id,slug,name"),
      supabaseAdmin
        .from("referral_clicks")
        .select("broker_id,user_id,device,created_at")
        .gte("created_at", since),
      supabaseAdmin.from("referral_conversions").select("broker_id"),
    ]);

    const brokers = brokersRows ?? [];
    const clicks = clicksRows ?? [];
    const conversions = convRows ?? [];

    const brokerMap = new Map(brokers.map((b: any) => [b.id, b]));

    const perBrokerMap = new Map<string, { slug: string; name: string; clicks: number; conversions: number }>();
    for (const b of brokers) perBrokerMap.set(b.id, { slug: b.slug, name: b.name, clicks: 0, conversions: 0 });

    const dailyMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const userSet = new Set<string>();

    for (const c of clicks as any[]) {
      const entry = perBrokerMap.get(c.broker_id);
      if (entry) entry.clicks += 1;
      const d = String(c.created_at).slice(0, 10);
      dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1);
      const dev = c.device ?? "unknown";
      deviceMap.set(dev, (deviceMap.get(dev) ?? 0) + 1);
      if (c.user_id) userSet.add(c.user_id);
    }
    for (const cv of conversions as any[]) {
      const entry = perBrokerMap.get(cv.broker_id);
      if (entry) entry.conversions += 1;
    }

    const perBroker = Array.from(perBrokerMap.values()).sort((a, b) => b.clicks - a.clicks);
    const top = perBroker[0];

    const daily = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, clicks]) => ({ date, clicks }));

    const recent = (clicks as any[])
      .slice()
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, 20)
      .map((c) => ({
        broker: (brokerMap.get(c.broker_id) as any)?.name ?? "Unknown",
        device: c.device,
        created_at: c.created_at,
      }));

    const totalClicks = clicks.length;
    const totalConversions = conversions.length;

    return {
      totalClicks,
      uniqueUsers: userSet.size,
      totalConversions,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      topBroker: top && top.clicks > 0 ? { name: top.name, clicks: top.clicks } : null,
      perBroker,
      daily,
      recent,
      deviceBreakdown: Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count })),
      error: null,
    };
  });
