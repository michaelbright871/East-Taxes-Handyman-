import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Boxes,
  CalendarCheck,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Shield,
  Star,
  Sun,
  Users,
  UserCog,
  X,
} from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/site/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { relativeTime, useRows } from "@/lib/admin/db";

export type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; group: string };

export const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "Overview" },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, group: "Overview" },

  { to: "/admin/customers", label: "Customers", icon: Users, group: "People" },
  { to: "/admin/agents", label: "Agents", icon: UserCog, group: "People" },
  { to: "/admin/security", label: "Security", icon: Shield, group: "People" },

  { to: "/admin/chats", label: "Live Chat", icon: MessageSquare, group: "Support" },
  { to: "/admin/ai", label: "AI Knowledge", icon: Bot, group: "Support" },
  { to: "/admin/canned-replies", label: "Canned Replies", icon: LifeBuoy, group: "Support" },

  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck, group: "Operations" },
  { to: "/admin/quotes", label: "Quotes", icon: FileText, group: "Operations" },
  { to: "/admin/services", label: "Services", icon: Boxes, group: "Operations" },
  { to: "/admin/reviews", label: "Reviews", icon: Star, group: "Operations" },

  { to: "/admin/content", label: "Website Content", icon: Boxes, group: "Content" },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon, group: "Content" },
  { to: "/admin/media", label: "Media Library", icon: ImageIcon, group: "Content" },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone, group: "Content" },

  { to: "/admin/settings", label: "Website Settings", icon: Settings, group: "System" },
  { to: "/admin/system", label: "System", icon: Activity, group: "System" },
];

const GROUPS = ["Overview", "People", "Support", "Operations", "Content", "System"];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-5 px-3 pb-6">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            {group}
          </p>
          <div className="space-y-0.5">
            {ADMIN_NAV.filter((i) => i.group === group).map((item) => {
              const active =
                item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as never}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-200",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4 transition-transform duration-200 group-hover:scale-110",
                      active && "text-primary",
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function NotificationsBell() {
  const { data = [], refetch } = useRows(
    "admin_notifications",
    { order: { column: "created_at", ascending: false }, limit: 20 },
    { refetchInterval: 30_000 },
  );
  const unread = data.filter((n) => !n["is_read"]).length;

  useEffect(() => {
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_notifications" },
        (payload) => {
          const row = payload.new as Record<string, any>;
          toast(row["title"], { description: row["body"] ?? undefined });
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(row["title"], { body: row["body"] ?? "" });
          }
          void refetch();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  const markAllRead = async () => {
    await (supabase.from("admin_notifications") as any).update({ is_read: true }).eq("is_read", false);
    void refetch();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-9">
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          <button
            onClick={markAllRead}
            className="text-xs text-primary transition-opacity hover:opacity-70"
          >
            Mark all read
          </button>
        </div>
        <ScrollArea className="max-h-80">
          {data.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">You're all caught up.</p>
          ) : (
            data.map((n) => (
              <div
                key={String(n["id"])}
                className={cn(
                  "border-b border-border/40 px-3 py-2.5 text-sm last:border-0",
                  !n["is_read"] && "bg-primary/5",
                )}
              >
                <p className="font-medium leading-tight">{n["title"]}</p>
                {n["body"] ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n["body"]}</p>
                ) : null}
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                  {relativeTime(n["created_at"])}
                </p>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="border-t border-border/60 p-2">
          <Link to={"/admin/notifications" as never} className="block">
            <Button variant="ghost" size="sm" className="w-full">
              View all
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CommandSearch() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const matches = useMemo(
    () =>
      q
        ? ADMIN_NAV.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
        : [],
    [q],
  );
  return (
    <div className="relative hidden md:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Jump to…"
        className="h-9 w-56 pl-8"
      />
      {matches.length ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {matches.map((m) => (
            <button
              key={m.to}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
              onClick={() => {
                setQ("");
                void navigate({ to: m.to as never });
              }}
            >
              <m.icon className="size-3.5 text-muted-foreground" />
              {m.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    void navigate({ to: "/admin/login" as never, replace: true });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  const initials = (user?.user_metadata?.["full_name"] ?? user?.email ?? "A")
    .toString()
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-muted/25">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-card lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
          <img
            src={logoUrl}
            alt="East Texas Handyman Services logo"
            width={72}
            height={72}
            className="size-8 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">Control Center</p>
            <p className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
              East Texas Handyman
            </p>
          </div>
        </div>
        <ScrollArea className="flex-1 py-3">
          <NavLinks />
        </ScrollArea>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 overlay backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-2xl duration-200 animate-in slide-in-from-left">
            <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
              <span className="text-sm font-semibold">Control Center</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 py-3">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </ScrollArea>
          </div>
        </div>
      ) : null}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/85 px-3 backdrop-blur-md sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <CommandSearch />
          <div className="ml-auto flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
            >
              <ExternalLink className="size-3.5" /> View site
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <NotificationsBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-8">
                    <AvatarImage src={user?.user_metadata?.["avatar_url"] ?? undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  <p className="truncate text-sm">{user?.email}</p>
                  <p className="text-[11px] font-normal uppercase tracking-wide text-muted-foreground">
                    {roles.join(", ") || "staff"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/security" as never })}>
                  <Shield className="mr-2 size-3.5" /> Security & sessions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" as never })}>
                  <Settings className="mr-2 size-3.5" /> Website settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 size-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-5 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
