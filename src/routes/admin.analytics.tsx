import { createFileRoute } from "@tanstack/react-router";
import { AdminCard, AdminPage, StatCard } from "@/components/admin/ui-bits";
import { useCount, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/analytics")({ ssr: false, component: AnalyticsAdmin });

function group(rows: Record<string, any>[], key: string) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[key] ?? "unknown");
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function Bars({ title, data }: { title: string; data: [string, number][] }) {
  const max = Math.max(1, ...data.map((d) => d[1]));
  return (
    <AdminCard title={title}>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {data.map(([label, value]) => (
            <li key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="truncate capitalize">{label}</span>
                <span className="tabular-nums text-muted-foreground">{value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}

function AnalyticsAdmin() {
  const { data: events = [] } = useRows("analytics_events", {
    order: { column: "created_at", ascending: false },
    limit: 1000,
  });
  const customers = useCount("profiles");
  const bookings = useCount("bookings");
  const quotes = useCount("quotes");
  const conversations = useCount("conversations");
  const views = events.filter((e) => e["event_type"] === "page_view").length;

  return (
    <AdminPage title="Analytics" description="Traffic, conversions, AI usage and audience insights.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Page views" value={views} />
        <StatCard label="Customers" value={customers.data ?? 0} />
        <StatCard
          label="Quote conversion"
          value={`${views ? Math.round(((quotes.data ?? 0) / views) * 100) : 0}%`}
        />
        <StatCard
          label="Booking conversion"
          value={`${views ? Math.round(((bookings.data ?? 0) / views) * 100) : 0}%`}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Bars title="Popular pages" data={group(events, "path")} />
        <Bars title="Traffic sources" data={group(events, "source")} />
        <Bars title="Devices" data={group(events, "device")} />
        <Bars title="Geography" data={group(events, "region")} />
      </div>
      <AdminCard title="Conversations">
        <p className="text-sm text-muted-foreground">
          {conversations.data ?? 0} total conversations handled by the AI assistant and live agents.
        </p>
      </AdminCard>
    </AdminPage>
  );
}
