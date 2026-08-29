import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { VideoBackdrop } from "./VideoBackdrop";
import { craftsmanshipVideoUrl } from "@/content/media";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  video?: string;
  crumb?: { label: string; to: string }[];
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, intro, video = craftsmanshipVideoUrl, crumb, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-32 lg:pb-20 lg:pt-40">
      <VideoBackdrop
        src={video}
        priority
        overlayClassName="bg-gradient-to-br from-steel/55 via-steel/35 to-steel/20"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.18em] text-steel-foreground/70">
          <Link to="/" className="transition-colors hover:text-brand">
            Home
          </Link>
          {crumb?.map((c) => (
            <span key={c.to} className="flex items-center gap-1">
              <ChevronRight className="size-3" />
              <Link to={c.to} className="transition-colors hover:text-brand">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
        <p className="eyebrow mt-6">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] text-steel-foreground sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-foreground/80">{intro}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
