import { ArrowRight, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "./booking/BookingProvider";
import { VideoBackdrop } from "./VideoBackdrop";
import { business } from "./business";
import heroImage from "@/assets/hero-handyman.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useContentBlock } from "@/hooks/useContent";
import { useMedia } from "@/hooks/useMedia";

const badges = [
  { icon: ShieldCheck, label: "Insured & Reliable" },
  { icon: Star, label: "Quality Craftsmanship" },
  { icon: MapPin, label: "Serving East Texas" },
];

export function Hero() {
  const { open } = useBooking();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const { data: media } = useMedia();
  const { data: content } = useContentBlock("hero_content");

  const videoUrl = media?.["hero-video"] || "/videos/hero.mp4";
  const heroTitle = content?.["title"] || "Honest, Reliable Handyman Work Across East Texas";
  const heroBody = content?.["body"] || "East Texas Handyman Services handles the repairs, installations, and improvements that keep your home or rental property in top shape — from drywall and carpentry to painting, doors, decks, and pressure washing. Straightforward pricing, careful workmanship, and projects finished on time.";

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 -z-10">
        <VideoBackdrop
          src={videoUrl}
          poster={heroImage}
          priority
          overlayClassName="bg-gradient-to-br from-steel/60 via-steel/40 to-transparent"
        />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-up">Longview, Texas · Home Repair & Maintenance</p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-5 text-4xl leading-[1.05] text-steel-foreground sm:text-5xl lg:text-6xl"
          >
            {heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-steel-foreground/80 sm:text-lg"
          >
            {heroBody}
          </motion.p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="xl" onClick={() => open("estimate")}>
              Get Free Estimate <ArrowRight className="size-4" />
            </Button>
            <Button variant="onDark" size="xl" asChild>
              <a href={business.phoneHref}>
                <Phone className="size-4" /> {business.phone}
              </a>
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {badges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-steel-foreground/75"
              >
                <Icon className="size-4 text-brand" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 hidden glass-dark border-t border-steel-foreground/10 bg-steel/40 backdrop-blur-xl lg:block"
      >
        <dl className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-steel-foreground/10 px-8">
          {[
            ["15+ Years", "Hands-on repair experience"],
            ["17 Services", "One trusted local crew"],
            ["Free Estimates", "Clear, honest pricing"],
            ["On Schedule", "Timely project completion"],
          ].map(([value, label]) => (
            <div key={value} className="px-6 py-5 group cursor-default">
              <dt className="font-display text-xl text-brand group-hover:scale-110 transition-transform origin-left inline-block">{value}</dt>
              <dd className="mt-1 text-sm text-steel-foreground/70">{label}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
