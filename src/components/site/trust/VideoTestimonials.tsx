import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SmartImage } from "../SmartImage";
import { videoTestimonials, type VideoTestimonial } from "./trust-data";

/** Customer video testimonials that open in a lightweight modal player. */
export function VideoTestimonials() {
  const [active, setActive] = useState<VideoTestimonial | null>(null);

  return (
    <section id="video-stories" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Video Testimonials</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">Hear It From Our Customers</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Short walkthroughs recorded on completed jobs across Longview, Kilgore and Tyler.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {videoTestimonials.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group overflow-hidden rounded-lg border border-border bg-card text-left transition-colors duration-300 hover:border-brand/50"
            >
              <div className="relative">
                <SmartImage
                  src={item.poster}
                  alt={`${item.name} video testimonial`}
                  wrapperClassName="aspect-video"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-steel/25 transition-colors duration-300 group-hover:bg-steel/10">
                  <span className="flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="size-6 fill-current" />
                  </span>
                </span>
              </div>
              <div className="p-6">
                <p className="font-display text-base text-foreground">{item.name}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {item.location} · {item.service}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-border bg-card p-0">

          <DialogTitle className="sr-only">{active?.name} video testimonial</DialogTitle>
          <DialogDescription className="sr-only">{active?.summary}</DialogDescription>
          {active ? (
            <div>
              <div className="relative">
                <video
                  key={active.id}
                  src={active.videoSrc}
                  poster={active.poster}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full bg-steel"
                />


              </div>
              <div className="p-6">
                <p className="font-display text-lg text-foreground">{active.name}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {active.location} · {active.service}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.summary}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
