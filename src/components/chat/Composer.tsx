import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUp, Camera, FileText, Image as ImageIcon, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "ethhs-chat-draft-v1";

/** Square attachment thumbnail with a loading spinner and a remove control. */
function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");
  const url = useMemo(() => (isImage ? URL.createObjectURL(file) : ""), [file, isImage]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  return (
    <div className="relative size-[68px] overflow-hidden rounded-[16px] border border-border bg-muted">
      {isImage ? (
        <img
          src={url}
          alt={file.name}
          onLoad={() => setLoaded(true)}
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        <span className="flex size-full flex-col items-center justify-center gap-1 px-1 text-center">
          <FileText className="size-5 text-muted-foreground" />
          <span className="w-full truncate text-[9px] text-muted-foreground">{file.name}</span>
        </span>
      )}

      {isImage && !loaded && (
        <span className="absolute inset-0 flex items-center justify-center bg-muted/70">
          <Loader2 className="size-6 animate-spin text-foreground/70" />
        </span>
      )}

      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={onRemove}
        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background shadow-md transition-transform hover:scale-110"
      >
        <X className="size-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function Composer({
  onSend,
  onBeforeSend,
  disabled,
  placeholder = "Message Ranger",
}: {
  onSend: (text: string, files: File[]) => void | Promise<void>;
  /** Return false to block sending (e.g. redirect to sign in). */
  onBeforeSend?: () => boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [plusOpen, setPlusOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  /* draft restore + persist */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) setText(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      if (text) window.localStorage.setItem(DRAFT_KEY, text);
      else window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [text]);

  /* auto-grow */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (disabled || (!text.trim() && files.length === 0)) return;
    if (onBeforeSend && !onBeforeSend()) return;
    const payload = { text, files };
    setText("");
    setFiles([]);
    await onSend(payload.text, payload.files);
    inputRef.current?.focus();
  };

  const pick = (newFiles: FileList | File[] | null) => {
    if (!newFiles) return;
    const array = Array.from(newFiles);
    if (array.length === 0) return;
    setFiles((prev) => [...prev, ...array].slice(0, 5));
    setPlusOpen(false);
  };

  return (
    <div className="relative px-3 pb-3 pt-1">
      {plusOpen && (
        <>
          <button
            type="button"
            aria-label="Close attachment menu"
            onClick={() => setPlusOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute bottom-[70px] left-3 z-20 w-[252px] overflow-hidden rounded-[28px] border border-border bg-popover py-2 shadow-2xl">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex w-full items-center gap-4 px-4 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <Camera className="size-5" />
              </span>
              <span className="text-[17px] font-semibold">Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-4 px-4 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="size-5" />
              </span>
              <span className="text-[17px] font-semibold">Photos</span>
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />

      <form
        onSubmit={submit}
        className="rounded-[28px] border border-border bg-card shadow-sm"
      >
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-border/50 px-4 py-3">
            {files.map((f, i) => (
              <FilePreview
                key={`${f.name}-${i}-${f.size}`}
                file={f}
                onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
              />
            ))}
          </div>
        )}

        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          className="max-h-[140px] w-full resize-none bg-transparent px-4 py-3 text-[17px] leading-6 outline-none placeholder:text-muted-foreground"
        />

        <div className="flex items-center justify-between pb-2 pl-2 pr-2">
          <button
            type="button"
            aria-label="Add attachment"
            onClick={() => setPlusOpen((v) => !v)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent",
              plusOpen && "bg-accent",
            )}
          >
            <Plus className="size-6" strokeWidth={1.75} />
          </button>
          <button
            type="submit"
            disabled={disabled || (!text.trim() && files.length === 0)}
            aria-label="Send message"
            className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground transition-all hover:bg-brand/90 active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
          >
            <ArrowUp className="size-5" strokeWidth={2.25} />
          </button>
        </div>
      </form>
    </div>
  );
}
