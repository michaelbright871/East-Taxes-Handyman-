import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

/** Sign-in button, or the signed-in user's Google avatar with a small menu. */
export function AuthControl({ className }: { className?: string }) {
  const { user, isStaff, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => void navigate({ to: "/auth", search: { next: "/" } as never })}
        className={cn(
          "flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 font-display text-xs uppercase tracking-wider text-surface-foreground transition-colors hover:bg-surface-foreground/10 hover:text-brand",
          className,
        )}
      >
        <LogIn className="size-3.5" /> Sign in
      </button>
    );
  }

  const meta = user.user_metadata ?? {};
  const avatar = (meta["avatar_url"] as string | undefined) ?? (meta["picture"] as string | undefined);
  const name = (meta["full_name"] as string | undefined) ?? user.email ?? "Account";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Your account"
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-surface-foreground/20 transition-all hover:ring-brand"
      >
        {avatar ? (
          <img src={avatar} alt={name} className="size-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex size-full items-center justify-center bg-brand text-sm font-semibold text-brand-foreground">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border bg-popover py-2 shadow-2xl">
          <p className="truncate px-4 pb-2 text-sm font-semibold text-foreground">{name}</p>
          {isStaff && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
            >
              <LayoutDashboard className="size-4" /> Admin Portal
            </Link>
          )}
          <Link
            to="/"
            hash="estimate"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            <User className="size-4" /> My requests
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-accent"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
