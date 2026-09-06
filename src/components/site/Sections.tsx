import { BadgeCheck, Clock, HandCoins, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackdrop } from "./VideoBackdrop";
import { SmartImage } from "./SmartImage";
import { business } from "./business";
import aboutImage from "@/assets/about-team.jpg";
import carpentryImage from "@/assets/service-carpentry.jpg";
import paintingImage from "@/assets/service-painting.jpg";
import drywallImage from "@/assets/service-drywall.jpg";
import deckImage from "@/assets/service-deck.jpg";
import washImage from "@/assets/service-pressure-washing.jpg";
import maintenanceImage from "@/assets/service-home-maintenance.jpg";
import exteriorRepaintImage from "@/assets/project-exterior-repaint.jpg";
import { motion } from "framer-motion";
import { ParallaxSection } from "./effects/ParallaxSection";
import { PerspectiveCard } from "./effects/PerspectiveCard";
import { useContentBlock } from "@/hooks/useContent";
import { useMedia } from "@/hooks/useMedia";

const values = [
  {
    icon: BadgeCheck,
    title: "Quality Craftsmanship",
    copy: "Work done right the first time, with materials and methods that hold up for years.",
  },
  {
    icon: HandCoins,
    title: "Honest Pricing",
    copy: "Clear written estimates before we start — no surprise charges once the work begins.",
  },
  {
    icon: Clock,
    title: "Timely Completion",
    copy: "We show up when we say we will and finish on the schedule we agreed to.",
  },
  {
    icon: Ruler,
    title: "Attention to Detail",
    copy: "Clean lines, level installs, and a tidy job site left better than we found it.",
  },
];

const work = [
  { src: carpentryImage, alt: "Carpenter cutting a wood board during a home renovation", label: "Carpentry & Trim" },
  { src: paintingImage, alt: "Painter rolling fresh paint on an interior wall", label: "Interior Painting" },
  { src: drywallImage, alt: "Hands smoothing joint compound over a drywall patch", label: "Drywall Repair" },
  { src: deckImage, alt: "Handyman replacing boards on a backyard deck", label: "Deck Repair" },
  { src: washImage, alt: "Pressure washing a concrete driveway", label: "Pressure Washing" },
  { src: maintenanceImage, alt: "Handyman completing a seasonal home maintenance checklist", label: "Property Maintenance" },
];

export function About() {
  const { data: content } = useContentBlock("about_intro");
  
  const heading = content?.["heading"] || "A Local Crew East Texas Homeowners Can Count On";
  const body = content?.["content"] || `${business.name} is a trusted local handyman company serving Longview and the surrounding East Texas communities with residential and light commercial repair, maintenance, installation, and improvement work. We built this business on reliable workmanship and straightforward communication — the kind of service neighbors recommend to neighbors.`;

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <SmartImage
            src={aboutImage}
            alt="East Texas Handyman Services technician with a fully stocked work van in Longview, Texas"
            width={1200}
            height={1000}
            wrapperClassName="rounded-lg shadow-xl aspect-6/5"
            className="h-full w-full object-cover"
          />
          <div className="absolute -bottom-6 left-6 rounded-md bg-brand px-6 py-4 text-brand-foreground dark:text-white shadow-[0_10px_30px_rgba(var(--brand),0.3)] sm:left-auto sm:-right-6 glass border border-white/20">
            <p className="font-display text-2xl">Locally Owned</p>
            <p className="text-sm">Longview &amp; East Texas</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="eyebrow">About Us</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {body}
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Homeowners, landlords, property managers, real estate agents, and small business owners
            call on us for everything from a single drywall patch to a full make-ready turnover. You
            get an honest quote, a firm timeline, and a finished result we're proud to put our name
            on.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <h3 className="text-base text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="brand" size="xl" className="mt-10" asChild>
            <a href="#estimate">Get Your Free Quote</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export function CraftsmanshipBand() {
  const { data: media } = useMedia();
  const videoUrl = media?.["craftsmanship-video"] || "/videos/craftsmanship.mp4";

  return (
    <section className="relative isolate overflow-hidden py-24 lg:py-28">
      <VideoBackdrop
        src={videoUrl}
        overlayClassName="bg-gradient-to-r from-steel/60 via-steel/40 to-steel/25"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Workmanship First</p>
          <h2 className="mt-4 text-3xl text-steel-foreground sm:text-4xl">
            Every Screw, Seam, and Coat Done the Right Way
          </h2>
          <p className="mt-5 leading-relaxed text-steel-foreground/80">
            Good handyman work is invisible — the door closes softly, the patch disappears into the
            wall, the deck board sits flush. That standard of detail is what we bring to every
            residential and light commercial project across East Texas.
          </p>
        </div>
        <dl className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            ["Prepared", "Right tools and materials on the truck before we arrive."],
            ["Precise", "Measured twice, installed level, finished clean."],
            ["Accountable", "We stand behind the work long after the job wraps."],
          ].map(([term, desc]) => (
            <div key={term} className="border-l-2 border-brand pl-5">
              <dt className="font-display text-xl uppercase tracking-wide text-steel-foreground">
                {term}
              </dt>
              <dd className="mt-2 text-sm text-steel-foreground/75">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}


export function Work() {
  const { data: media } = useMedia();

  const featured = [
    {
      video: media?.["carpentry-video"] || "/videos/carpentry.mp4",
      poster: carpentryImage,
      title: "Carpentry & Drywall",
      copy: "Trim, framing, shelving, and seamless drywall patching finished to blend into the existing space.",
    },
    {
      video: media?.["painting-video"] || "/videos/painting.mp4",
      poster: paintingImage,
      title: "Interior & Exterior Painting",
      copy: "Careful prep, clean cut lines, and durable finishes inside the house and out on the siding.",
    },
    {
      video: media?.["exterior-video"] || "/videos/exterior.mp4",
      poster: exteriorRepaintImage,
      title: "Exterior & Property Care",
      copy: "Pressure washing, fence and deck repair, and seasonal maintenance that protects your investment.",
    },
  ];

  return (
    <section id="work" className="bg-secondary/60 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Our Work</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Repairs, Installations, and Improvements Around East Texas
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            A look at the day-to-day projects we take on for homeowners, rental property owners, and
            local businesses throughout Longview and the surrounding area.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {featured.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative isolate overflow-hidden rounded-lg shadow-depth"
            >
              <PerspectiveCard>
                <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                  <VideoBackdrop
                    src={item.video}
                    poster={item.poster}
                    className="transition-transform duration-700 group-hover:scale-105"
                    overlayClassName="bg-gradient-to-t from-steel/90 via-steel/20 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: "translateZ(30px)" }}>
                    <h3 className="text-xl text-steel-foreground font-display uppercase tracking-wide">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-foreground/80">{item.copy}</p>
                  </div>
                </div>
              </PerspectiveCard>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {work.map((item) => (
            <figure key={item.label} className="group overflow-hidden rounded-lg shadow-sm">
              <SmartImage
                src={item.src}
                alt={item.alt}
                width={1200}
                height={900}
                wrapperClassName="aspect-4/3"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="bg-card px-4 py-3 font-display text-sm uppercase tracking-wider text-card-foreground">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
