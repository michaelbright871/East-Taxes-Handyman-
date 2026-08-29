import { useEffect, useRef } from "react";
import { Bold, Italic, Link2, List, ListOrdered, Underline, Heading2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight rich-text editor used across the Admin CMS.
 * Stores HTML, no external dependency, keyboard friendly.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight = 160,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const tools = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Underline, label: "Underline", run: () => exec("underline") },
    { icon: Heading2, label: "Heading", run: () => exec("formatBlock", "<h3>") },
    { icon: List, label: "Bulleted list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    {
      icon: Link2,
      label: "Link",
      run: () => {
        const url = window.prompt("Link URL");
        if (url) exec("createLink", url);
      },
    },
    { icon: Undo2, label: "Undo", run: () => exec("undo") },
  ];

  return (
    <div className={cn("overflow-hidden rounded-lg border border-input bg-background", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/40 px-1.5 py-1">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <t.icon className="size-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        style={{ minHeight }}
        className="prose prose-sm max-w-none px-3 py-2 text-sm text-foreground outline-none [&_a]:text-primary [&_a]:underline [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
