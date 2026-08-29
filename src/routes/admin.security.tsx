import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminCard, AdminPage, StatusPill } from "@/components/admin/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/security")({
  ssr: false,
  component: SecurityAdmin,
});

function SecurityAdmin() {
  const { user, roles } = useAuth();
  const { data: activity = [] } = useRows("login_activity", {
    order: { column: "created_at", ascending: false },
    limit: 25,
  });
  const { data: lockouts = [] } = useRows("account_lockouts", {
    order: { column: "updated_at", ascending: false },
    limit: 25,
  });
  const { data: securityRows = [], refetch } = useRows("admin_security", { limit: 5 });
  const mine = securityRows.find((r) => r["user_id"] === user?.id);

  const [twoFactor, setTwoFactor] = useState(Boolean(mine?.["two_factor_enabled"]));
  const [timeout_, setTimeout_] = useState(Number(mine?.["session_timeout_minutes"] ?? 60));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await (supabase.from("admin_security") as any).upsert({
      user_id: user.id,
      two_factor_enabled: twoFactor,
      session_timeout_minutes: timeout_,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Security preferences saved");
      void refetch();
    }
  };

  return (
    <AdminPage title="Security" description="Two-factor, sessions, login activity and lockout protection.">
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title="Your account" description={user?.email ?? ""}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Require a second step when signing in.</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Session timeout (minutes)</Label>
              <Input
                type="number"
                value={timeout_}
                min={5}
                onChange={(e) => setTimeout_(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Roles: {roles.join(", ") || "—"}
            </div>
            <Button size="sm" onClick={save} disabled={saving}>
              Save security settings
            </Button>
          </div>
        </AdminCard>

        <AdminCard title="Account lockouts" description="Accounts blocked after repeated failed sign-ins" bodyClassName="p-0">
          <div className="divide-y divide-border/50">
            {lockouts.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No lockouts recorded.</p>
            ) : (
              lockouts.map((l) => (
                <div key={String(l["email"])} className="flex items-center gap-2 px-4 py-2.5 text-sm">
                  <Shield className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{l["email"]}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {l["failed_attempts"]} failed
                  </span>
                  <StatusPill value={l["locked_until"] ? "suspended" : "active"} />
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Login activity" bodyClassName="p-0">
        <div className="divide-y divide-border/50">
          {activity.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No sign-ins recorded yet.</p>
          ) : (
            activity.map((a) => (
              <div key={String(a["id"])} className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm">
                <span className="truncate font-medium">{a["email"] ?? "—"}</span>
                <span className="truncate text-xs text-muted-foreground">{a["user_agent"] ?? ""}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDate(a["created_at"], true)}
                </span>
                <StatusPill value={a["success"] ? "approved" : "rejected"} />
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </AdminPage>
  );
}
