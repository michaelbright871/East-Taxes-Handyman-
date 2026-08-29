import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

export type UploadResult = {
  url: string;
  path: string;
  name: string;
  size: number;
  type: "image" | "video" | "file";
  mimeType: string;
};

export function kindOf(file: File): "image" | "video" | "file" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export function formatBytes(bytes?: number | null) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Uploads a file to the public media bucket and returns its public URL. */
export async function uploadToMedia(file: File, folder = "library"): Promise<UploadResult> {
  const ext = file.name.split(".").pop() ?? "bin";
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 60);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    ...(file.type ? { contentType: file.type } : {}),
  });

  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return {
    url: data.publicUrl,
    path,
    name: file.name,
    size: file.size,
    type: kindOf(file),
    mimeType: file.type || `application/${ext}`,
  };
}

/** Uploads and registers the asset inside the media library table. */
export async function uploadAndRegister(file: File, folderId?: string | null) {
  const uploaded = await uploadToMedia(file);
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await (supabase.from("media_assets") as any)
    .insert({
      name: uploaded.name,
      url: uploaded.url,
      storage_path: uploaded.path,
      type: uploaded.type,
      mime_type: uploaded.mimeType,
      size_bytes: uploaded.size,
      folder_id: folderId ?? null,
      uploaded_by: userData.user?.id ?? null,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function removeFromMedia(path?: string | null) {
  if (!path) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
