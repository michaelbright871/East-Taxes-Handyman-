import { useMemo, useState, type ReactNode } from "react";
import {
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  downloadCsv,
  formatDate,
  logActivity,
  money,
  useDeleteRows,
  useRows,
  useUpsertRow,
  type Row,
} from "@/lib/admin/db";
import { uploadToMedia } from "@/lib/admin/storage";
import { AdminCard, EmptyState, StatusPill, TableSkeleton } from "./ui-bits";
import { RichTextEditor } from "./RichTextEditor";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "money"
  | "boolean"
  | "select"
  | "date"
  | "datetime"
  | "media"
  | "tags"
  | "json"
  | "status";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: unknown;
  inTable?: boolean;
  full?: boolean;
  render?: (row: Row) => ReactNode;
};

export type ResourceConfig = {
  table: string;
  singular: string;
  plural: string;
  fields: Field[];
  searchColumns?: string[];
  defaultSort?: { column: string; ascending?: boolean };
  filters?: { name: string; label: string; options: { label: string; value: string }[] }[];
  canCreate?: boolean;
  canDelete?: boolean;
  rowActions?: (row: Row) => ReactNode;
  emptyHint?: string;
};

function emptyValues(fields: Field[]): Row {
  const out: Row = {};
  for (const f of fields) {
    out[f.name] =
      f.defaultValue ??
      (f.type === "boolean"
        ? false
        : f.type === "number" || f.type === "money"
          ? 0
          : f.type === "tags"
            ? []
            : f.type === "json"
              ? []
              : "");
  }
  return out;
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  const [uploading, setUploading] = useState(false);

  if (field.readOnly) {
    return (
      <div className="flex min-h-9 items-center rounded-md border border-border/40 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        {value ?? "—"}
      </div>
    );
  }

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          value={value ?? ""}
          rows={4}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "richtext":
      return (
        <RichTextEditor
          value={value ?? ""}
          onChange={onChange}
          placeholder={field.placeholder ?? "Write here…"}
        />
      );
    case "boolean":
      return (
        <div className="flex h-9 items-center">
          <Switch checked={Boolean(value)} onCheckedChange={onChange} />
        </div>
      );
    case "number":
    case "money":
      return (
        <Input
          type="number"
          step={field.type === "money" ? "0.01" : "1"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          value={value ? String(value).slice(0, 10) : ""}
          onChange={(e) => onChange(e.target.value || null)}
        />
      );
    case "datetime":
      return (
        <Input
          type="datetime-local"
          value={value ? String(value).slice(0, 16) : ""}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
        />
      );
    case "status":
    case "select":
      return (
        <Select value={value ? String(value) : ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "tags":
      return (
        <Input
          value={Array.isArray(value) ? value.join(", ") : (value ?? "")}
          placeholder={field.placeholder ?? "Comma separated"}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      );
    case "json":
      return (
        <Textarea
          rows={5}
          className="font-mono text-xs"
          value={typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              onChange(e.target.value);
            }
          }}
        />
      );
    case "media":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={value ?? ""}
              placeholder="https://… or upload"
              onChange={(e) => onChange(e.target.value)}
            />
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const res = await uploadToMedia(file, "fields");
                    onChange(res.url);
                  } catch (err) {
                    toast.error((err as Error).message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              <span className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-input px-3 text-sm transition-colors hover:bg-accent">
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                Upload
              </span>
            </label>
          </div>
          {value ? (
            <div className="overflow-hidden rounded-md border border-border/60 bg-muted/30">
              {String(value).match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                <video src={value} className="h-28 w-full object-cover" muted />
              ) : (
                <img src={value} alt="" className="h-28 w-full object-cover" loading="lazy" />
              )}
            </div>
          ) : null}
        </div>
      );
    default:
      return (
        <Input
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function RecordDialog({
  open,
  onOpenChange,
  config,
  record,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  config: ResourceConfig;
  record: Row | null;
  onSaved?: () => void;
}) {
  const upsert = useUpsertRow(config.table);
  const [values, setValues] = useState<Row>(() => record ?? emptyValues(config.fields));

  // reset values whenever the dialog opens for a different record
  const recordKey = record?.["id"] ?? "new";
  const [key, setKey] = useState(recordKey);
  if (key !== recordKey) {
    setKey(recordKey);
    setValues(record ?? emptyValues(config.fields));
  }

  const save = async () => {
    const payload: Row = { ...values };
    for (const f of config.fields) {
      if (f.required && (payload[f.name] === "" || payload[f.name] === null)) {
        toast.error(`${f.label} is required`);
        return;
      }
      if (payload[f.name] === "") payload[f.name] = null;
    }
    try {
      await upsert.mutateAsync(payload);
      void logActivity(record ? `updated ${config.singular}` : `created ${config.singular}`, config.table, record?.["id"]);
      toast.success(`${config.singular} ${record ? "updated" : "created"}`);
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? `Edit ${config.singular}` : `New ${config.singular}`}
          </DialogTitle>
          <DialogDescription>
            Changes are saved instantly and reflected across the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((f) => (
            <div
              key={f.name}
              className={cn(
                "space-y-1.5",
                (f.full || f.type === "richtext" || f.type === "textarea" || f.type === "json") &&
                  "sm:col-span-2",
              )}
            >
              <Label className="text-xs font-medium">{f.label}</Label>
              <FieldInput
                field={f}
                value={values[f.name]}
                onChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
              />
              {f.help ? <p className="text-[11px] text-muted-foreground">{f.help}</p> : null}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={upsert.isPending}>
            {upsert.isPending ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cellValue(field: Field, row: Row) {
  const v = row[field.name];
  if (field.render) return field.render(row);
  switch (field.type) {
    case "boolean":
      return (
        <span className={cn("text-xs font-medium", v ? "text-emerald-600" : "text-muted-foreground")}>
          {v ? "Yes" : "No"}
        </span>
      );
    case "money":
      return money(v);
    case "date":
    case "datetime":
      return formatDate(v, field.type === "datetime");
    case "status":
      return <StatusPill value={v} />;
    case "media":
      return v ? (
        <img src={v} alt="" className="size-9 rounded-md object-cover" loading="lazy" />
      ) : (
        "—"
      );
    case "tags":
      return Array.isArray(v) && v.length ? v.join(", ") : "—";
    case "richtext":
      return (
        <span className="line-clamp-1 text-muted-foreground">
          {String(v ?? "").replace(/<[^>]*>/g, "") || "—"}
        </span>
      );
    default:
      return v === null || v === undefined || v === "" ? (
        "—"
      ) : (
        <span className="line-clamp-1">{String(v)}</span>
      );
  }
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);

  const eq = useMemo(() => {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(filters)) if (v && v !== "all") out[k] = v;
    return out;
  }, [filters]);

  const { data = [], isLoading } = useRows(config.table, {
    order: config.defaultSort ?? { column: "created_at", ascending: false },
    eq,
    ...(search && config.searchColumns?.length
      ? { search: { term: search, columns: config.searchColumns } }
      : {}),
  });

  const del = useDeleteRows(config.table);
  const tableFields = config.fields.filter((f) => f.inTable !== false).slice(0, 6);

  const doDelete = async (ids: string[]) => {
    try {
      await del.mutateAsync(ids);
      void logActivity(`deleted ${config.singular}`, config.table, ids.join(","));
      toast.success(`${ids.length} ${ids.length === 1 ? config.singular : config.plural} deleted`);
      setSelected([]);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AdminCard bodyClassName="p-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 p-3">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            className="h-9 pl-8"
          />
        </div>
        {(config.filters ?? []).map((f) => (
          <Select
            key={f.name}
            value={filters[f.name] ?? "all"}
            onValueChange={(v) => setFilters((prev) => ({ ...prev, [f.name]: v }))}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {f.label.toLowerCase()}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {selected.length ? (
          <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(selected)}>
            <Trash2 className="mr-1.5 size-3.5" /> Delete ({selected.length})
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadCsv(`${config.table}-${Date.now()}`, data)}
        >
          <Download className="mr-1.5 size-3.5" /> Export
        </Button>
        {config.canCreate !== false ? (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 size-3.5" /> New {config.singular.toLowerCase()}
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton cols={tableFields.length} />
          </div>
        ) : data.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={`No ${config.plural.toLowerCase()} yet`}
              description={config.emptyHint ?? `Create your first ${config.singular.toLowerCase()} to get started.`}
              action={
                config.canCreate !== false ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditing(null);
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1.5 size-3.5" /> New {config.singular.toLowerCase()}
                  </Button>
                ) : null
              }
            />
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-3 py-2">
                  <Checkbox
                    checked={selected.length > 0 && selected.length === data.length}
                    onCheckedChange={(v) =>
                      setSelected(v ? data.map((r) => String(r["id"])) : [])
                    }
                  />
                </th>
                {tableFields.map((f) => (
                  <th key={f.name} className="px-3 py-2 font-medium">
                    {f.label}
                  </th>
                ))}
                <th className="w-12 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={String(row["id"])}
                  className="border-b border-border/40 transition-colors last:border-0 hover:bg-accent/40"
                >
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selected.includes(String(row["id"]))}
                      onCheckedChange={(v) =>
                        setSelected((prev) =>
                          v
                            ? [...prev, String(row["id"])]
                            : prev.filter((id) => id !== String(row["id"])),
                        )
                      }
                    />
                  </td>
                  {tableFields.map((f) => (
                    <td key={f.name} className="max-w-[260px] px-3 py-2 align-middle">
                      {cellValue(f, row)}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(row);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 size-3.5" /> Edit
                        </DropdownMenuItem>
                        {config.rowActions?.(row)}
                        {config.canDelete !== false ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setConfirmDelete([String(row["id"])])}
                          >
                            <Trash2 className="mr-2 size-3.5" /> Delete
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dialogOpen ? (
        <RecordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          config={config}
          record={editing}
        />
      ) : null}

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDelete?.length} item(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The records will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmDelete) void doDelete(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminCard>
  );
}
