import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------ */
/* Generic table access (RLS enforced — admin/agent role required)      */
/* ------------------------------------------------------------------ */

export type Row = Record<string, any>;

export type ListOptions = {
  select?: string;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  eq?: Record<string, string | number | boolean | null>;
  neq?: Record<string, string | number | boolean | null>;
  gte?: Record<string, string | number>;
  search?: { term: string; columns: string[] };
};

export function tableKey(table: string, opts?: unknown) {
  return ["admin", table, opts ?? null] as const;
}

export async function listRows(table: string, opts: ListOptions = {}): Promise<Row[]> {
  let q = (supabase.from(table as never) as any).select(opts.select ?? "*");
  for (const [k, v] of Object.entries(opts.eq ?? {})) q = v === null ? q.is(k, null) : q.eq(k, v);
  for (const [k, v] of Object.entries(opts.neq ?? {})) q = q.neq(k, v);
  for (const [k, v] of Object.entries(opts.gte ?? {})) q = q.gte(k, v);
  if (opts.search?.term && opts.search.columns.length) {
    const term = opts.search.term.replace(/[%,()]/g, " ").trim();
    if (term) q = q.or(opts.search.columns.map((c) => `${c}.ilike.%${term}%`).join(","));
  }
  if (opts.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Row[];
}

export function useRows(
  table: string,
  opts: ListOptions = {},
  queryOptions?: Partial<UseQueryOptions<Row[]>>,
) {
  return useQuery<Row[]>({
    queryKey: tableKey(table, opts),
    queryFn: () => listRows(table, opts),
    staleTime: 15_000,
    ...queryOptions,
  });
}

export function useCount(table: string, opts: { eq?: Record<string, any>; gte?: Record<string, any> } = {}) {
  return useQuery<number>({
    queryKey: ["admin-count", table, opts],
    queryFn: async () => {
      let q = (supabase.from(table as never) as any).select("*", { count: "exact", head: true });
      for (const [k, v] of Object.entries(opts.eq ?? {})) q = q.eq(k, v);
      for (const [k, v] of Object.entries(opts.gte ?? {})) q = q.gte(k, v);
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 15_000,
  });
}

export function useInvalidateTable(table: string) {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["admin", table] });
    void qc.invalidateQueries({ queryKey: ["admin-count", table] });
  };
}

export function useUpsertRow(table: string) {
  const invalidate = useInvalidateTable(table);
  return useMutation({
    mutationFn: async (values: Row) => {
      const payload = { ...values };
      const isUpdate = Boolean(payload["id"]) || Boolean(payload["key"] && table === "site_settings");
      if (isUpdate && payload["id"]) {
        const id = payload["id"];
        delete payload["id"];
        delete payload["created_at"];
        const { data, error } = await (supabase.from(table as never) as any)
          .update(payload)
          .eq("id", id)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      }
      const { data, error } = await (supabase.from(table as never) as any)
        .upsert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteRows(table: string, idColumn = "id") {
  const invalidate = useInvalidateTable(table);
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await (supabase.from(table as never) as any).delete().in(idColumn, ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: invalidate,
  });
}

export function usePatchRow(table: string, idColumn = "id") {
  const invalidate = useInvalidateTable(table);
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Row }) => {
      const { error } = await (supabase.from(table as never) as any).update(patch).eq(idColumn, id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

/* ------------------------------------------------------------------ */
/* Activity + notifications                                            */
/* ------------------------------------------------------------------ */

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  metadata: Row = {},
) {
  try {
    const { data } = await supabase.auth.getUser();
    await (supabase.from("activity_logs") as any).insert({
      actor_id: data.user?.id ?? null,
      actor_name: data.user?.user_metadata?.["full_name"] ?? data.user?.email ?? "system",
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata,
    });
  } catch {
    /* logging must never break the UI */
  }
}

export async function notifyAdmins(input: {
  type: string;
  title: string;
  body?: string;
  href?: string;
  severity?: "info" | "success" | "warning" | "error";
}) {
  try {
    await (supabase.from("admin_notifications") as any).insert({
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
      severity: input.severity ?? "info",
    });
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* CSV export                                                          */
/* ------------------------------------------------------------------ */

export function toCsv(rows: Row[], columns?: string[]): string {
  if (!rows.length) return "";
  const cols = columns ?? Object.keys(rows[0]!);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function downloadCsv(filename: string, rows: Row[], columns?: string[]) {
  const csv = toCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export function formatDate(value?: string | null, withTime = false) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

export function relativeTime(value?: string | null) {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function money(value?: number | string | null) {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
