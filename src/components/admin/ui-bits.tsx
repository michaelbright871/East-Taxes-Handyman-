import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-card shadow-sm ring-1 ring-black/[0.02]",
        className,
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
            ) : null}
            {description ? (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  loading?: boolean;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    default: "text-primary bg-primary/10",
    success: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    warning: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    danger: "text-red-600 bg-red-500/10 dark:text-red-400",
  };
  return (
    <div className="group rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-20" />
          ) : (
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          )}
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110",
              tones[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const STATUS_TONES: Record<string, string> = {
  active: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  approved: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  completed: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  online: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  confirmed: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  pending: "bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25",
  queued: "bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25",
  scheduled: "bg-sky-500/12 text-sky-700 dark:text-sky-400 border-sky-500/25",
  live: "bg-sky-500/12 text-sky-700 dark:text-sky-400 border-sky-500/25",
  ai: "bg-violet-500/12 text-violet-700 dark:text-violet-400 border-violet-500/25",
  rejected: "bg-red-500/12 text-red-700 dark:text-red-400 border-red-500/25",
  cancelled: "bg-red-500/12 text-red-700 dark:text-red-400 border-red-500/25",
  suspended: "bg-red-500/12 text-red-700 dark:text-red-400 border-red-500/25",
  hidden: "bg-muted text-muted-foreground border-border",
  closed: "bg-muted text-muted-foreground border-border",
  offline: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({ value, className }: { value?: string | null; className?: string }) {
  const key = (value ?? "").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        STATUS_TONES[key] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {value ?? "—"}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-muted-foreground">{icon}</div> : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-9 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
