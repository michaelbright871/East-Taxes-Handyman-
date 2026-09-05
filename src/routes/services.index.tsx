import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { servicesVideoUrl } from "@/content/media";
import { SmartImage } from "@/components/site/SmartImage";
import { useBooking } from "@/components/site/booking/BookingProvider";
import { business } from "@/components/site/business";
import { services } from "@/content/services";
import {
  BrochureCTA,
  HowItWorks,
  PricingGuide,
} from "@/components/site/content/ContentSections";

const TITLE = "Handyman Services in Longview, TX | East Texas Handyman Services";
const DESCRIPTION =
  "Explore every handyman service we offer in East Texas: carpentry, drywall, interior & exterior painting, doors, windows, flooring, fences, decks, pressure washing and more.";

export const Route = createFileRoute("/services/")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Services"
        title="Complete Handyman Services for Homes, Rentals & Small Businesses"
        intro="Seventeen trades under one dependable local crew. Pick a service to see what's included, how long it takes, and what it typically costs."
        video={servicesVideoUrl}
        crumb={[{ label: "Services", to: "/services" }]}
      >
        <ServiceHeroActions />
      </PageHero>

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  <SmartImage
                    src={service.image}
                    alt={`${service.title} services in East Texas`}
                    wrapperClassName="aspect-[16/9] w-full"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                        <Icon className="size-5" />
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
                        Go to <ArrowRight className="size-3" />
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-medium text-card-foreground">{service.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.short}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Duration
                        </span>
                        <span className="mt-1 text-xs text-foreground">{service.duration}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Starting at
                        </span>
                        <span className="mt-1 font-display text-base text-brand">
                          {service.pricing.startingFrom}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PricingGuide />
      <HowItWorks />
      <BrochureCTA />
    </SiteLayout>
  );
}

function ServiceHeroActions() {
  const { open } = useBooking();
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="brand" size="xl" onClick={() => open("estimate")}>
        Get Free Estimate <ArrowRight className="size-4" />
      </Button>
      <Button variant="onDark" size="xl" asChild>
        <a href={business.phoneHref}>
          <Phone className="size-4" /> {business.phone}
        </a>
      </Button>
      <span className="hidden items-center gap-2 text-sm text-steel-foreground/75 sm:flex">
        <Check className="size-4 text-brand" /> Free written quotes
      </span>
    </div>
  );
}
