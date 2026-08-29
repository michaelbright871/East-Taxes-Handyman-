import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminPage, StatCard, StatusPill } from "@/components/admin/ui-bits";
import { formatDate, relativeTime, useCount, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: Dashboard,
});

function since(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function Dashboard() {
  const visitors = useCount("analytics_events", { eq: { event_type: "page_view" }, gte: { created_at: since(30) } });
  const customers = useCount("profiles");
  const aiChats = useCount("conversations", { eq: { mode: "ai" } });
  const liveChats = useCount("conversations", { eq: { mode: "live" } });
  const bookings = useCount("bookings");
  const quotes = useCount("quotes");
  const pending = useCount("bookings", { eq: { status: "pending" } });
  const completed = useCount("bookings", { eq: { status: "completed" } });

  const { data: reviews = [] } = useRows("reviews", { limit: 200 });
  const rated = reviews.filter((r) => Number(r["rating"]) > 0);
  const satisfaction = rated.length
    ? (rated.reduce((a, r) => a + Number(r["rating"]), 0) / rated.length).toFixed(1)
    : "—";

  const { data: activity = [], isLoading: activityLoading } = useRows("activity_logs", {
    order: { column: "created_at", ascending: false },
    limit: 12,
  });
  const { data: recentBookings = [] } = useRows("bookings", {
    order: { column: "created_at", ascending: false },
    limit: 6,
  });

  return (
    <AdminPage
      title="Dashboard"
      description="A live snapshot of your website, customers and operations."
      actions={
        <>
          <Link to={"/admin/bookings" as never}>
            <Button size="sm" variant="outline">
              <CalendarCheck className="mr-1.5 size-3.5" /> Bookings
            </Button>
          </Link>
          <Link to={"/admin/content" as never}>
            <Button size="sm">
              <Plus className="mr-1.5 size-3.5" /> Edit website
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors (30d)" value={visitors.data ?? 0} loading={visitors.isLoading} icon={<BarChart3 className="size-4" />} />
        <StatCard label="Customers" value={customers.data ?? 0} loading={customers.isLoading} icon={<Users className="size-4" />} />
        <StatCard label="AI conversations" value={aiChats.data ?? 0} loading={aiChats.isLoading} icon={<Bot className="size-4" />} />
        <StatCard label="Live chats" value={liveChats.data ?? 0} loading={liveChats.isLoading} icon={<MessageSquare className="size-4" />} tone="success" />
        <StatCard label="Bookings" value={bookings.data ?? 0} loading={bookings.isLoading} icon={<CalendarCheck className="size-4" />} />
        <StatCard label="Quote requests" value={quotes.data ?? 0} loading={quotes.isLoading} icon={<FileText className="size-4" />} />
        <StatCard label="Pending requests" value={pending.data ?? 0} loading={pending.isLoading} icon={<Clock className="size-4" />} tone="warning" />
        <StatCard label="Completed jobs" value={completed.data ?? 0} loading={completed.isLoading} icon={<CheckCircle2 className="size-4" />} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard title="Recent activity" description="Everything your team changed" className="lg:col-span-2" bodyClassName="p-0">
          <div className="divide-y divide-border/50">
            {activityLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Loading…</p>
            ) : activity.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              activity.map((a) => (
                <div key={String(a["id"])} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Activity className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <span className="font-medium">{a["actor_name"] ?? "System"}</span> {a["action"]}
                      {a["entity_type"] ? <span className="text-muted-foreground"> · {a["entity_type"]}</span> : null}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{relativeTime(a["created_at"])}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard title="Customer satisfaction">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold tabular-nums">{satisfaction}</span>
              <div className="text-xs text-muted-foreground">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                Based on {rated.length} reviews
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Website status">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Public site</span>
                <StatusPill value="online" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <StatusPill value="active" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">AI assistant</span>
                <StatusPill value="online" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Live chat</span>
                <StatusPill value="online" />
              </li>
            </ul>
          </AdminCard>

          <AdminCard title="Quick actions" bodyClassName="grid grid-cols-2 gap-2 p-4">
            {[
              { to: "/admin/bookings", label: "Bookings" },
              { to: "/admin/quotes", label: "Quotes" },
              { to: "/admin/chats", label: "Live chat" },
              { to: "/admin/media", label: "Media" },
            ].map((q) => (
              <Link key={q.to} to={q.to as never}>
                <Button variant="outline" size="sm" className="w-full">
                  {q.label}
                </Button>
              </Link>
            ))}
          </AdminCard>
        </div>
      </div>

      <AdminCard title="Latest bookings" bodyClassName="p-0">
        <div className="divide-y divide-border/50">
          {recentBookings.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={String(b["id"])} className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
                <span className="font-medium">{b["customer_name"]}</span>
                <span className="text-muted-foreground">{b["service_name"] ?? "—"}</span>
                <span className="ml-auto text-xs text-muted-foreground">{formatDate(b["created_at"], true)}</span>
                <StatusPill value={b["status"]} />
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </AdminPage>
  );
}
