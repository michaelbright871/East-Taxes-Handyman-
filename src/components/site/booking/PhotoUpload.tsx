import { useCallback, useRef, useState } from "react";
import { Camera, ImagePlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedPhoto {
  id: string;
  name: string;
  url: string;
  size: number;
}

interface PhotoUploadProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  max?: number;
  className?: string;
}

/**
 * Multi-photo picker with drag & drop, mobile gallery, camera capture and previews.
 */
export function PhotoUpload({ photos, onChange, max = 8, className }: PhotoUploadProps) {
  const [dragging, setDragging] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const room = Math.max(0, max - photos.length);
      const picked = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, room);
      if (!picked.length) return;

      // Data URLs survive step changes (object URLs get revoked on unmount).
      const added = await Promise.all(
        picked.map(
          (file) =>
            new Promise<UploadedPhoto>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
                  name: file.name,
                  url: String(reader.result),
                  size: file.size,
                });
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            }),
        ),
      );
      onChange([...photos, ...added]);
    },
    [max, onChange, photos],
  );

  const remove = (id: string) => onChange(photos.filter((photo) => photo.id !== id));

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragging ? "border-brand bg-brand/5" : "border-border bg-muted/30",
        )}
      >
        <ImagePlus className="mx-auto size-6 text-brand" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Drag &amp; drop project photos here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG or PNG · up to {max} photos · helps us quote accurately
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Upload className="size-4" /> Choose photos
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent sm:hidden"
          >
            <Camera className="size-4" /> Take photo
          </button>
        </div>

        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="group relative overflow-hidden rounded-md border border-border animate-fade-up"
            >
              <img src={photo.url} alt={photo.name} className="h-24 w-full object-cover" />
              <button
                type="button"
                aria-label={`Remove ${photo.name}`}
                onClick={() => remove(photo.id)}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-steel/80 text-steel-foreground transition-colors hover:bg-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
