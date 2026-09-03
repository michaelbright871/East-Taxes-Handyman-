import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingBrochureButton } from "../PricingBrochure";
import { useBooking } from "../booking/BookingProvider";
import { business } from "../business";
import { brochure, howItWorks, whyChooseUs } from "@/content/company";
import { featuredServices, services } from "@/content/services";
import { SmartImage } from "../SmartImage";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Choose Us</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            The Reasons East Texas Keeps Calling Us Back
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Six things we hold ourselves to on every single job, whether it is a one-hour repair or a
            full property turnover.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="group rounded-lg border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg text-card-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { open } = useBooking();

  return (
    <section id="process" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">How It Works</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Five Simple Steps From First Call to Finished Job
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            No guesswork and no surprises. You know what happens next at every stage of the project.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {howItWorks.map(({ icon: Icon, step, title, copy }) => (
            <li
              key={step}
              className="relative rounded-lg border border-border bg-card p-6 transition-colors duration-300 hover:border-brand/40"
            >
              <span className="font-display text-3xl text-brand/30">{step}</span>
              <span className="mt-3 flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base text-card-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button variant="brand" size="xl" onClick={() => open("estimate")}>
            Start With a Free Estimate <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="xl" asChild>
            <a href={business.phoneHref}>
              <Phone className="size-4" /> {business.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FeaturedServicesShowcase() {
  return (
    <section className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Featured Services</p>
            <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Our Most Requested Work in East Texas
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              View All Services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.slice(0, 6).map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <SmartImage
                src={service.image}
                alt={`${service.title} in Longview, Texas`}
                wrapperClassName="aspect-[16/10] w-full"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg text-card-foreground">{service.title}</h3>
                  <span className="font-display text-sm text-brand">{service.pricing.startingFrom}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-display text-xs uppercase tracking-wider text-brand">
                  Learn More <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingGuide() {
  const { open } = useBooking();

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Pricing Guide</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Typical Price Ranges, Published Up Front
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every project is different, but these are the ranges most jobs fall into. Your written
            estimate is always free and always fixed before work begins.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-lg border border-border">
          <table className="w-full min-w-full text-left text-sm">
            <thead className="bg-secondary/60">
              <tr className="font-display uppercase tracking-wider text-foreground">
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Starting From</th>
                <th className="hidden px-5 py-4 sm:table-cell">Typical Range</th>
                <th className="hidden px-5 py-4 md:table-cell">Typical Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {services.map((service) => (
                <tr key={service.slug} className="transition-colors hover:bg-accent/50">
                  <td className="px-5 py-4">
                    <Link
                      to="/services/$slug"
                      params={{ slug: service.slug }}
                      className="font-medium text-card-foreground transition-colors hover:text-brand"
                    >
                      {service.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-display text-brand">{service.pricing.startingFrom}</td>
                  <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                    {service.pricing.typicalRange}
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">{service.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Ranges are estimates for planning only. Final pricing depends on scope, materials, and site
          conditions and is confirmed in your free written estimate.
        </p>

        <div className="mt-8">
          <Button variant="brand" size="xl" onClick={() => open("estimate")}>
            Get My Exact Price <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function BrochureCTA() {
  const { open } = useBooking();

  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Download</p>
          <h2 className="mt-3 text-2xl text-foreground sm:text-3xl">{brochure.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{brochure.copy}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{brochure.note}</p>
        </div>
        <PricingBrochureButton />
      </div>
    </section>
  );
}
