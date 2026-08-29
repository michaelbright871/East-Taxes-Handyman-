import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Control Center — East Texas Handyman" },
      { name: "description", content: "Private administration area for East Texas Handyman Services." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isStaff, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isPublic = PUBLIC_ADMIN_PATHS.includes(pathname);

  useEffect(() => {
    if (loading || isPublic) return;
    if (!user) void navigate({ to: "/admin/login" as never, replace: true });
  }, [loading, isPublic, user, navigate]);

  if (isPublic) return <Outlet />;

  if (loading || (!user && !isPublic)) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/25">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/25 px-6">
        <div className="max-w-sm rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-3 size-8 text-destructive" />
          <h1 className="text-lg font-semibold">Access restricted</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This account doesn’t have staff permissions for the Control Center.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/" as never })}>
              Back to site
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                await signOut();
                void navigate({ to: "/admin/login" as never, replace: true });
              }}
            >
              Sign in as staff
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
