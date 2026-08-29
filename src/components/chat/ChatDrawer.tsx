import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Pin,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { business } from "@/components/site/business";
import { useAuth } from "@/hooks/useAuth";
import type { ChatConversation } from "./chat-types";

type Props = {
  open: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onPin: (id: string, pinned: boolean) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

function Row({
  convo,
  active,
  onSelect,
  onPin,
  onRename,
  onDelete,
}: {
  convo: ChatConversation;
  active: boolean;
  onSelect: () => void;
  onPin: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(convo.title);
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    hold.current = setTimeout(() => setMenu(true), 450);
  };
  const cancel = () => {
    if (hold.current) clearTimeout(hold.current);
    hold.current = null;
  };

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRename(draft);
          setEditing(false);
        }}
        className="px-3 py-1"
      >
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onRename(draft);
            setEditing(false);
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[16px] outline-none"
        />
      </form>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu(true);
        }}
        onTouchStart={start}
        onTouchEnd={cancel}
        onTouchMove={cancel}
        onMouseDown={start}
        onMouseUp={cancel}
        onMouseLeave={cancel}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[17px] transition-colors hover:bg-accent",
          active && "bg-accent",
        )}
      >
        {convo.pinned && <MessageSquare className="size-5 shrink-0 text-muted-foreground" />}
        <span className="min-w-0 flex-1 truncate">{convo.title}</span>
      </button>

      {menu && (
        <>
          <button
            type="button"
            aria-label="Close conversation menu"
            onClick={() => setMenu(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-2 top-9 z-40 w-[220px] overflow-hidden rounded-[24px] border border-border bg-popover py-2 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                onPin();
                setMenu(false);
              }}
              className="flex w-full items-center gap-4 px-5 py-2.5 text-left text-[17px] transition-colors hover:bg-accent"
            >
              <Pin className="size-5" /> {convo.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(convo.title);
                setEditing(true);
                setMenu(false);
              }}
              className="flex w-full items-center gap-4 px-5 py-2.5 text-left text-[17px] transition-colors hover:bg-accent"
            >
              <Pencil className="size-5" /> Rename
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                setMenu(false);
              }}
              className="flex w-full items-center gap-4 px-5 py-2.5 text-left text-[17px] text-destructive transition-colors hover:bg-accent"
            >
              <Trash2 className="size-5" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ChatDrawer({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNew,
  onPin,
  onRename,
  onDelete,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setSearching(false);
      setQuery("");
    }
  }, [open]);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const pinned = filtered.filter((c) => c.pinned);
  const recents = filtered.filter((c) => !c.pinned);

  const avatarUrl =
    (user?.user_metadata?.["avatar_url"] as string | undefined) ??
    (user?.user_metadata?.["picture"] as string | undefined);
  const initials = (
    (user?.user_metadata?.["full_name"] as string | undefined) ??
    user?.email ??
    "G"
  )
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-30 bg-foreground/25 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-40 flex w-[82%] max-w-[300px] flex-col bg-background shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          {searching ? (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full rounded-full bg-muted px-4 py-2 text-[16px] outline-none"
            />
          ) : (
            <h2 className="font-display text-[22px] uppercase leading-tight tracking-wide">
              East Texas Handyman
            </h2>
          )}
          <button
            type="button"
            aria-label="Search chats"
            onClick={() => setSearching((v) => !v)}
            className="ml-2 flex size-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <Search className="size-5" />
          </button>
        </div>

        <nav className="px-3 pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              void navigate({ to: "/", hash: "estimate" });
            }}
            className="flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-left text-[17px] transition-colors hover:bg-accent"
          >
            <CalendarCheck className="size-6" strokeWidth={1.75} /> Request
          </button>
          <a
            href={business.phoneHref}
            className="flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-[17px] transition-colors hover:bg-accent"
          >
            <Phone className="size-6" strokeWidth={1.75} /> Call {business.phone}
          </a>
          <a
            href={business.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-[17px] transition-colors hover:bg-accent"
          >
            <MessageCircle className="size-6" strokeWidth={1.75} /> Message
          </a>
        </nav>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {pinned.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-3 text-[17px] text-muted-foreground">Pinned</p>
              {pinned.map((c) => (
                <Row
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onSelect={() => onSelect(c.id)}
                  onPin={() => onPin(c.id, !c.pinned)}
                  onRename={(t) => onRename(c.id, t)}
                  onDelete={() => onDelete(c.id)}
                />
              ))}
            </>
          )}

          <p className="px-3 pb-1 pt-4 text-[17px] text-muted-foreground">Recents</p>
          {recents.length === 0 && (
            <p className="px-3 py-2 text-[15px] text-muted-foreground">No conversations yet.</p>
          )}
          {recents.map((c) => (
            <Row
              key={c.id}
              convo={c}
              active={c.id === activeId}
              onSelect={() => onSelect(c.id)}
              onPin={() => onPin(c.id, !c.pinned)}
              onRename={(t) => onRename(c.id, t)}
              onDelete={() => onDelete(c.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onNew();
              onClose();
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[17px] font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            <SquarePen className="size-5" /> Chat
          </button>
          {user ? (
            avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Your profile"
                className="size-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-[15px] font-semibold text-surface-foreground">
                {initials}
              </span>
            )
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                void navigate({ to: "/auth", search: { next: "/", chat: "1" } as never });
              }}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-semibold"
            >
              In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
