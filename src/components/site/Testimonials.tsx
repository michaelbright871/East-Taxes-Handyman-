import { Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackdrop } from "./VideoBackdrop";
import { useBooking } from "./booking/BookingProvider";
import { testimonialsVideoUrl } from "@/content/media";

const reviews = [
  {
    quote:
      "They repaired drywall in two rooms, rehung a sticking exterior door, and painted our hallway — all in one visit. Fair price, no mess left behind, and everything looks perfect.",
    name: "Amanda R.",
    role: "Homeowner · Longview",
  },
  {
    quote:
      "I manage several rentals and needed a make-ready turned around fast. Flooring repair, fixture swaps, and touch-up paint were finished ahead of schedule. My go-to crew now.",
    name: "Dwight C.",
    role: "Property Manager · Kilgore",
  },
  {
    quote:
      "Rebuilt a sagging fence gate and pressure washed the driveway and patio before a listing photo shoot. Professional, on time, and the curb appeal difference sold the house.",
    name: "Kelsey M.",
    role: "Real Estate Agent · Tyler",
  },
];

const audiences = [
  "Homeowners",
  "Property Managers",
  "Rental Property Owners",
  "Small Businesses",
  "Real Estate Agents",
  "Landlords",
];

export function Testimonials() {
  const { open } = useBooking();

  return (
    <section id="reviews" className="relative isolate overflow-hidden py-24 lg:py-32">
      <VideoBackdrop
        src={testimonialsVideoUrl}
        overlayClassName="bg-gradient-to-b from-steel/55 via-steel/40 to-steel/55"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Customer Satisfaction</p>
          <h2 className="mt-4 text-3xl text-steel-foreground sm:text-4xl lg:text-5xl">
            Trusted by East Texas Homeowners and Property Owners
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex h-full flex-col rounded-lg border border-steel-foreground/15 bg-steel-foreground/5 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-brand/50"
            >
              <Quote className="size-7 text-brand" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-steel-foreground/85">
                {review.quote}
              </blockquote>
              <div className="mt-6 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand text-brand" />
                ))}
              </div>
              <figcaption className="mt-4 border-t border-steel-foreground/15 pt-4">
                <p className="font-display text-base text-steel-foreground">{review.name}</p>
                <p className="text-xs uppercase tracking-widest text-steel-foreground/60">
                  {review.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3">
          <span className="font-display text-sm uppercase tracking-widest text-steel-foreground/60">
            We work with:
          </span>
          {audiences.map((item) => (
            <span
              key={item}
              className="rounded-full border border-steel-foreground/20 px-4 py-1.5 text-sm text-steel-foreground/80"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button variant="brand" size="xl" onClick={() => open("estimate")}>
            Request Estimate
          </Button>
          <Button variant="onDark" size="xl" onClick={() => open("inspection")}>
            Schedule Inspection
          </Button>
        </div>
      </div>
    </section>
  );
}
