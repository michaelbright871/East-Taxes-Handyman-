import { createFileRoute } from "@tanstack/react-router";
import { AdminCard, AdminPage, StatusPill } from "@/components/admin/ui-bits";
import { Button } from "@/components/ui/button";
import { downloadJson, formatDate, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/system")({ ssr: false, component: SystemAdmin });

function SystemAdmin() {
  const { data: activity = [] } = useRows("activity_logs", {
    order: { column: "created_at", ascending: false },
    limit: 50,
  });
  const { data: errors = [] } = useRows("error_logs", {
    order: { column: "created_at", ascending: false },
    limit: 50,
  });

  return (
    <AdminPage title="System" description="Activity logs, error logs and data export.">
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard
          title="Activity log"
          actions={
            <Button size="sm" variant="outline" onClick={() => downloadJson("activity-logs", activity)}>
              Export
            </Button>
          }
          bodyClassName="p-0"
        >
          <div className="max-h-80 divide-y divide-border/50 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activity.map((a) => (
                <div key={String(a["id"])} className="px-4 py-2.5 text-sm">
                  <p className="font-medium">{a["action"]}</p>
                  <p className="text-xs text-muted-foreground">
                    {a["actor_name"] ?? "system"} · {formatDate(a["created_at"], true)}
                  </p>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        <AdminCard
          title="Error log"
          actions={
            <Button size="sm" variant="outline" onClick={() => downloadJson("error-logs", errors)}>
              Export
            </Button>
          }
          bodyClassName="p-0"
        >
          <div className="max-h-80 divide-y divide-border/50 overflow-y-auto">
            {errors.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No errors recorded.</p>
            ) : (
              errors.map((e) => (
                <div key={String(e["id"])} className="flex items-start gap-2 px-4 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e["message"]}</p>
                    <p className="text-xs text-muted-foreground">
                      {e["path"] ?? "—"} · {formatDate(e["created_at"], true)}
                    </p>
                  </div>
                  <StatusPill value={e["resolved"] ? "approved" : "pending"} />
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
