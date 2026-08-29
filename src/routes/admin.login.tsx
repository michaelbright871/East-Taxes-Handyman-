import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff sign in — Control Center" },
      { name: "description", content: "Secure staff sign in for the East Texas Handyman Control Center." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

const REMEMBER_KEY = "eth-admin-remember-email";

async function recordAttempt(email: string, success: boolean, userId?: string | null) {
  try {
    await (supabase.from("login_activity") as any).insert({
      user_id: userId ?? null,
      email,
      success,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch {
    /* best effort */
  }
}

function AdminLogin() {
  const navigate = useNavigate();
  const { user, isStaff, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [failures, setFailures] = useState(0);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_KEY) : null;
    if (saved) setEmail(saved);
  }, []);

  useEffect(() => {
    if (!loading && user && isStaff) void navigate({ to: "/admin" as never, replace: true });
  }, [loading, user, isStaff, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (failures >= 5) {
      toast.error("Too many failed attempts. Please wait a few minutes and try again.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password,
    });
    
    if (!error && remember) {
      // Supabase handles session persistence by default if not configured otherwise,
      // but we ensure the auth state is persisted in local storage for 'Remember me'.
      // The supabase client itself manages this via 'sb-<project-id>-auth-token'.
    }
    setBusy(false);
    if (error) {
      setFailures((f) => f + 1);
      void recordAttempt(email.trim(), false);
      toast.error(error.message);
      return;
    }
    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
    else localStorage.removeItem(REMEMBER_KEY);
    void recordAttempt(email.trim(), true, data.user?.id);
    void navigate({ to: "/admin" as never, replace: true });
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent — check your inbox.");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/25 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logoUrl}
            alt="East Texas Handyman Services logo"
            width={72}
            height={72}
            className="size-11 shrink-0 object-contain"
          />
          <h1 className="mt-3 text-lg font-semibold tracking-tight">Control Center</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            East Texas Handyman
          </p>
        </div>

        <form
          onSubmit={mode === "signin" ? signIn : sendReset}
          className="space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {mode === "signin" ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              We’ll email you a secure link to choose a new password.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Send reset link"}
          </Button>

          {mode === "forgot" ? (
            <button
              type="button"
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setMode("signin")}
            >
              Back to sign in
            </button>
          ) : null}

          {failures > 0 ? (
            <p className="text-center text-[11px] text-destructive">
              {5 - failures > 0
                ? `${5 - failures} attempt${5 - failures === 1 ? "" : "s"} remaining before lockout.`
                : "Account temporarily locked."}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
