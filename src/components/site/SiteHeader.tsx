import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { business } from "./business";
import { ThemeToggle } from "./ThemeToggle";
import { AuthControl } from "./AuthControl";
import { useBooking } from "./booking/BookingProvider";
import { MENU_STATE_EVENT } from "./FloatingHub";


const links: { label: string; to: string; hash?: string }[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Pricing", to: "/services", hash: "pricing" },
  { label: "Reviews", to: "/", hash: "reviews" },
  { label: "Contact", to: "/", hash: "estimate" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openBooking } = useBooking();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHomePage) return;

    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(MENU_STATE_EVENT, { detail: open }));
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass shadow-depth py-1 dark:glass-dark"
          : "bg-gradient-to-b from-surface/40 to-transparent py-2 lg:py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 lg:px-8 lg:py-2.5">
        <Link
          to="/"
          onClick={handleBrandClick}
          className="flex items-center gap-2 text-surface-foreground"
        >
          <img
            src={logoUrl}
            alt="East Texas Handyman Services logo"
            width={72}
            height={72}
            className="size-8 shrink-0 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-[13px] uppercase tracking-wide sm:text-sm">
              East Texas Handyman
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-surface-foreground/60">
              Services · Longview, TX
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              {...(link.hash ? { hash: link.hash } : {})}
              className="font-display text-sm uppercase tracking-wider text-surface-foreground/80 transition-colors hover:text-brand"
              activeProps={{ className: "text-brand" }}
              activeOptions={{ exact: link.to === "/" && !link.hash, includeHash: Boolean(link.hash) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-surface-foreground transition-colors hover:text-brand"
          >
            <Phone className="size-4" />
            {business.phone}
          </a>
          <ThemeToggle />
          <AuthControl />
          <Button variant="brand" size="lg" onClick={() => openBooking("estimate")}>
            Free Estimate
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <AuthControl />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-md text-surface-foreground transition-colors hover:bg-surface-foreground/10"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

      </div>

      <div
        className={cn(
          "grid overflow-y-auto overscroll-contain bg-surface/98 backdrop-blur-md transition-[grid-template-rows,opacity] duration-300 lg:hidden",
          open
            ? "max-h-[calc(100svh-4.5rem)] grid-rows-[1fr] opacity-100"
            : "max-h-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1 px-5 pb-6 pt-2">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                {...(link.hash ? { hash: link.hash } : {})}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 font-display text-sm uppercase tracking-wider text-surface-foreground/85 transition-colors hover:bg-surface-foreground/10 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between rounded-md border border-surface-foreground/15 px-3 py-2.5">
              <span className="font-display text-sm uppercase tracking-wider text-surface-foreground/85">
                Dark Mode
              </span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="brand"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  openBooking("estimate");
                }}
              >
                Request Free Estimate
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={business.phoneHref}>Call {business.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
