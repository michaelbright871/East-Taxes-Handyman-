import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, DollarSign, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { FaqAccordion } from "@/components/site/content/FaqAccordion";
import { useBooking } from "@/components/site/booking/BookingProvider";
import { business } from "@/components/site/business";
import { getService, services } from "@/content/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { title: service.title, short: service.short };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service Not Found | East Texas Handyman Services" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} in Longview, TX | East Texas Handyman Services`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.short },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="We couldn't find that service"
        intro="The page you're looking for may have moved. Browse the full list of handyman services we offer across East Texas."
        crumb={[{ label: "Services", to: "/services" }]}
      >
        <Button variant="brand" size="xl" asChild>
          <Link to="/services">View All Services</Link>
        </Button>
      </PageHero>
    </SiteLayout>
  );
}

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  const { open } = useBooking();

  if (!service) return <ServiceNotFound />;

  const Icon = service.icon;
  const related = service.related
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Handyman Service"
        title={service.title}
        intro={service.short}
        crumb={[{ label: "Services", to: "/services" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="brand" size="xl" onClick={() => open("estimate", service.quoteId)}>
            Get Free Estimate <ArrowRight className="size-4" />
          </Button>
          <Button variant="onDark" size="xl" asChild>
            <a href={business.phoneHref}>
              <Phone className="size-4" /> {business.phone}
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <div className="min-w-0">
            <SmartImage
              src={service.image}
              alt={`${service.title} by East Texas Handyman Services`}
              priority
              wrapperClassName="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border"
              className="size-full object-cover"
            />

            <span className="mt-8 flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
              <Icon className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">Service Overview</h2>
            {service.overview.map((p) => (
              <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}

            <h2 className="mt-12 text-2xl text-foreground sm:text-3xl">Benefits</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {service.benefits.map((b) => (
                <div key={b.title} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base text-card-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.copy}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl text-foreground sm:text-3xl">Common Repairs We Handle</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.commonRepairs.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="font-display text-lg uppercase tracking-wide text-foreground">Our Process</h3>
            <div className="mt-5 space-y-0">
              {service.process.map((p, index) => (
                <div key={p.step} className="group block py-3.5 text-left">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-foreground">{p.step}</p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.copy}</p>
                  {index < 2 ? <div className="mt-3 border-t border-border/80" /> : null}
                </div>
              ))}
            </div>

            {service.comparison ? (
              <>
                <h2 className="mt-12 text-2xl text-foreground sm:text-3xl">{service.comparison.title}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[service.comparison.optionA, service.comparison.optionB].map((option) => (
                    <div key={option.label} className="rounded-lg border border-border bg-card p-6">
                      <h3 className="font-display text-lg uppercase tracking-wide text-brand">{option.label}</h3>
                      <ul className="mt-4 space-y-2">
                        {option.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.comparison.guidance}</p>
              </>
            ) : null}

            <h2 className="mt-12 text-2xl text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-6">
              <FaqAccordion items={service.faqs} />
            </div>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-lg uppercase tracking-wide text-card-foreground">At a Glance</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 size-4 text-brand" />
                  <div>
                    <dt className="text-muted-foreground">Starting from</dt>
                    <dd className="font-display text-base text-card-foreground">{service.pricing.startingFrom}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wrench className="mt-0.5 size-4 text-brand" />
                  <div>
                    <dt className="text-muted-foreground">Typical range</dt>
                    <dd className="font-display text-base text-card-foreground">{service.pricing.typicalRange}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 text-brand" />
                  <div>
                    <dt className="text-muted-foreground">Typical duration</dt>
                    <dd className="font-display text-base text-card-foreground">{service.duration}</dd>
                  </div>
                </div>
              </dl>
              <Button variant="brand" size="lg" className="mt-6 w-full" onClick={() => open("booking", service.quoteId)}>
                Book This Service
              </Button>
              <Button variant="outline" size="lg" className="mt-3 w-full" asChild>
                <a href={business.whatsappHref} target="_blank" rel="noreferrer">Message Us Photos</a>
              </Button>
            </div>

            <div className="p-0">
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground">Related Services</h3>

              <div className="mt-5 space-y-0">
                {related.slice(0, 3).map((r, index) => (
                  <Link
                    key={r.slug}
                    to="/services/$slug"
                    params={{ slug: r.slug }}
                    className="group block py-3.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-foreground">{r.title}</p>
                      <ArrowRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.short}</p>
                    {index < 2 ? <div className="mt-3 border-t border-border/80" /> : null}
                  </Link>
                ))}
              </div>

              <Button variant="link" size="lg" className="mt-5 w-full justify-start p-0 text-left text-sm font-medium text-brand hover:no-underline" asChild>
                <Link to="/services">Browse all services</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
