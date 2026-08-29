import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminCard, AdminPage, EmptyState } from "@/components/admin/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBytes, removeFromMedia, uploadAndRegister } from "@/lib/admin/storage";
import { useDeleteRows, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/media")({ ssr: false, component: MediaAdmin });

function MediaAdmin() {
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: assets = [], refetch } = useRows("media_assets", {
    order: { column: "created_at", ascending: false },
    ...(search ? { search: { term: search, columns: ["name", "alt_text"] } } : {}),
  });
  const del = useDeleteRows("media_assets");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) await uploadAndRegister(file);
      toast.success(`${files.length} file(s) uploaded`);
      void refetch();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminPage
      title="Media library"
      description="Upload, organise and reuse every image and video on your website."
      actions={
        <Button size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Upload className="mr-1.5 size-3.5" />}
          Upload
        </Button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => void upload(e.target.files)}
      />
      <AdminCard bodyClassName="p-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media…"
          className="mb-3 h-9"
        />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void upload(e.dataTransfer.files);
          }}
          className="rounded-lg border border-dashed border-border/70 p-3"
        >
          {assets.length === 0 ? (
            <EmptyState title="No media yet" description="Drag files here or use the upload button." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {assets.map((a) => (
                <figure key={String(a["id"])} className="group overflow-hidden rounded-lg border border-border/60 bg-card">
                  {String(a["type"]) === "video" ? (
                    <video src={String(a["url"])} className="h-24 w-full object-cover" muted />
                  ) : (
                    <img src={String(a["url"])} alt={String(a["alt_text"] ?? a["name"])} className="h-24 w-full object-cover" loading="lazy" />
                  )}
                  <figcaption className="space-y-1 p-2">
                    <p className="truncate text-xs font-medium">{a["name"]}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{formatBytes(Number(a["size_bytes"]))}</span>
                      <button
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        onClick={async () => {
                          await removeFromMedia(a["storage_path"] as string);
                          await del.mutateAsync([String(a["id"])]);
                          void refetch();
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </AdminCard>
    </AdminPage>
  );
}
