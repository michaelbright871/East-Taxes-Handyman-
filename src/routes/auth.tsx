import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { business } from "@/components/site/business";

const TITLE = "Customer Sign In | East Texas Handyman Services";
const DESCRIPTION =
  "Sign in to your East Texas Handyman account to chat with a live agent, review estimates, bookings and past conversations.";

const searchSchema = z.object({
  next: z.string().optional(),
  chat: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { next, chat } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const destination = `${next && next.startsWith("/") ? next : "/"}${chat === "1" ? "?chat=1" : ""}`;

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: destination as never, replace: true });
    }
  }, [user, loading, destination, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        // Store "Remember me" preference for the Supabase client
        localStorage.setItem("ethhs-remember", remember ? "true" : "false");
        
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) throw error;
        toast.success("Welcome back!");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}${destination}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created — you're signed in.");
          void navigate({ to: destination as never, replace: true });
        } else {
          toast.success("Account created — check your inbox to confirm your email.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${destination}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    void navigate({ to: destination as never, replace: true });
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-surface p-12 text-surface-foreground lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="East Texas Handyman Services logo"
            width={72}
            height={72}
            className="size-8 shrink-0 object-contain"
          />
          <span className="font-display text-lg uppercase tracking-wide">
            East Texas Handyman
          </span>
        </Link>
        <div className="max-w-md space-y-5">
          <h1 className="font-display text-4xl uppercase leading-tight tracking-wide">
            Your account, your projects, one conversation.
          </h1>
          <p className="text-surface-foreground/70">
            Sign in to chat with a live team member, keep your conversation history, revisit
            estimates and manage your bookings — anytime.
          </p>
          <ul className="space-y-2 text-sm text-surface-foreground/70">
            {[
              "Talk to a real technician, not a bot",
              "Saved conversations, photos and quotes",
              "Faster estimates for repeat customers",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand" /> {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-surface-foreground/50">
          {business.addressLine} · {business.phone}
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-3.5" /> Back to site
          </Link>

          <h2 className="font-display text-3xl uppercase tracking-wide text-foreground">
            {mode === "signin"
              ? "Sign in"
              : mode === "signup"
                ? "Create account"
                : "Reset password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "We'll email you a secure link to set a new password."
              : "Live support and saved conversations for East Texas homeowners."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Miller"
                  autoComplete="name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-muted-foreground transition-colors hover:text-brand"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
              </div>
            )}
            {mode === "signin" && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                  aria-label="Remember me"
                />
                Remember me on this device
              </label>
            )}

            <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogle}
                disabled={busy}
              >
                <GoogleMark /> Continue with Google
              </Button>
            </>
          )}

          <p className={cn("mt-6 text-center text-sm text-muted-foreground")}>
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="font-medium text-brand hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Mail className="size-3.5" /> Email verification keeps your conversations secure.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5C17.9 1.1 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
