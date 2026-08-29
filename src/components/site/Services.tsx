import {
  Armchair,
  Blinds,
  Brush,
  DoorClosed,
  DoorOpen,
  Droplets,
  Fence,
  Hammer,
  Home,
  Layers,
  Lightbulb,
  PaintRoller,
  Ruler,
  Sparkles,
  Trees,
  Wrench,
  Wallpaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackdrop } from "./VideoBackdrop";
import { useBooking } from "./booking/BookingProvider";
import { business } from "./business";
import { PerspectiveCard } from "./effects/PerspectiveCard";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/useServices";
import { useMedia } from "@/hooks/useMedia";

const iconMap: Record<string, any> = {
  Home, Hammer, Wallpaper, PaintRoller, Brush, DoorOpen, DoorClosed, 
  Blinds, Armchair, Wrench, Lightbulb, Layers, Fence, Trees, Droplets, 
  Sparkles, Ruler
};

const services = [
  {
    icon: Home,
    title: "General Home Repairs",
    copy: "One dependable call for the punch list — squeaky doors, loose fixtures, worn trim, and the small repairs that add up.",
  },
  {
    icon: Hammer,
    title: "Carpentry",
    copy: "Custom trim, shelving, framing, and finish carpentry built with precise measurements and clean, lasting joinery.",
  },
  {
    icon: Wallpaper,
    title: "Drywall Repair",
    copy: "Holes, cracks, water damage, and texture matching patched and sanded so the wall looks like nothing ever happened.",
  },
  {
    icon: PaintRoller,
    title: "Interior Painting",
    copy: "Properly prepped walls, crisp cut lines, and even coverage that refreshes a room without the mess or the guesswork.",
  },
  {
    icon: Brush,
    title: "Exterior Painting",
    copy: "Siding, trim, fascia, and doors coated with weather-ready finishes that stand up to the East Texas sun and humidity.",
  },
  {
    icon: DoorOpen,
    title: "Door Installation",
    copy: "Interior, exterior, storm, and patio doors hung level, sealed tight, and adjusted to swing and latch perfectly.",
  },
  {
    icon: DoorClosed,
    title: "Door Repair",
    copy: "Sticking slabs, sagging hinges, failed strike plates, and damaged frames corrected for smooth, secure operation.",
  },
  {
    icon: Blinds,
    title: "Window Repair",
    copy: "Broken sashes, worn seals, stubborn hardware, and rotted sills repaired to restore comfort and cut drafts.",
  },
  {
    icon: Armchair,
    title: "Furniture Assembly",
    copy: "Flat-pack furniture, shelving units, and office setups assembled correctly, squared up, and safely anchored.",
  },
  {
    icon: Wrench,
    title: "Minor Plumbing Repairs",
    copy: "Dripping faucets, running toilets, garbage disposals, and supply lines handled quickly and cleanly.",
  },
  {
    icon: Lightbulb,
    title: "Light Electrical Fixtures",
    copy: "Ceiling fans, vanity lights, chandeliers, and outdoor fixtures swapped out and mounted with care.",
  },
  {
    icon: Layers,
    title: "Flooring Repairs",
    copy: "Loose planks, damaged laminate, squeaky subfloor, and worn transitions repaired for a level, quiet finish.",
  },
  {
    icon: Fence,
    title: "Fence Repair",
    copy: "Leaning posts, broken pickets, sagging gates, and storm damage rebuilt so your fence line stands straight again.",
  },
  {
    icon: Trees,
    title: "Deck Repair",
    copy: "Rotted boards replaced, railings re-secured, and surfaces sanded and sealed for a safe, inviting outdoor space.",
  },
  {
    icon: Droplets,
    title: "Pressure Washing",
    copy: "Driveways, walkways, siding, patios, and fences washed back to clean without damaging the surface underneath.",
  },
  {
    icon: Sparkles,
    title: "Home Maintenance",
    copy: "Scheduled seasonal upkeep — caulking, weatherstripping, gutters, and inspections that prevent expensive surprises.",
  },
  {
    icon: Ruler,
    title: "Property Improvements",
    copy: "Turnovers, small upgrades, and make-ready work for landlords, agents, and small businesses on a firm timeline.",
  },
];

export function Services() {
  const { open } = useBooking();
  const { data: dbServices, isLoading } = useServices();
  const { data: media } = useMedia();

  const videoUrl = media?.["services-video"] || "/videos/services.mp4";

  return (
    <section id="services" className="relative isolate overflow-hidden py-24 lg:py-32">
      <VideoBackdrop
        src={videoUrl}
        overlayClassName="bg-gradient-to-b from-background/70 via-background/55 to-background/70"
        className="opacity-100"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">What We Do</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Complete Handyman Services for Homes & Small Businesses
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            From a single repair to a full property punch list, every job gets the same attention to
            detail, honest pricing, and clean finish. If it needs fixing, installing, or refreshing,
            we can take care of it.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(dbServices || []).map((service, index) => {
            const Icon = iconMap[service.icon || "Wrench"] || Wrench;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <PerspectiveCard className="h-full">
                  <article
                    className="group h-full relative overflow-hidden rounded-xl border border-border bg-card/50 p-7 glass-dark transition-all duration-500 hover:border-brand/40 shadow-depth"
                  >
                    <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground group-hover:shadow-[0_0_20px_rgba(var(--brand),0.3)]">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg text-card-foreground group-hover:text-brand transition-colors">{service.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary || service.description}</p>
                  </article>
                </PerspectiveCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="brand" size="xl" onClick={() => open("estimate")}>
            Get Free Estimate
          </Button>
          <Button variant="outline" size="xl" onClick={() => open("booking")}>
            Book Service
          </Button>
          <Button variant="ghost" size="xl" asChild>
            <a href={business.phoneHref}>Call {business.phone}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
