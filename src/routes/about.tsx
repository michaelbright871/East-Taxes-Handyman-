import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { craftsmanshipVideoUrl } from "@/content/media";
import { SmartImage } from "@/components/site/SmartImage";
import {
  WhyChooseUs,
  HowItWorks,
} from "@/components/site/content/ContentSections";
import {
  certifications,
  companyIntro,
  coreValues,
  history,
  mission,
  safetyStandards,
  team,
} from "@/content/company";
import aboutImage from "@/assets/about-team.jpg";

const TITLE = "About East Texas Handyman Services | Longview, TX";
const DESCRIPTION =
  "Meet the locally owned handyman crew serving Longview and East Texas since 2010 — our history, mission, core values, certifications, insurance and safety standards.";

export const Route = createFileRoute("/about")({
  component: AboutPage,
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

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="Locally Owned, East Texas Built"
        intro="Fifteen years of hands-on repair work, one straightforward promise: honest pricing, kept appointments, and craftsmanship we stand behind."
        video={craftsmanshipVideoUrl}
        crumb={[{ label: "About", to: "/about" }]}
      />

      <section className="py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div className="min-w-0">
            <p className="eyebrow">Who We Are</p>
            <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">{companyIntro.heading}</h2>
            {companyIntro.body.map((p) => (
              <p key={p} className="mt-5 text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
          <SmartImage
            src={aboutImage}
            alt="East Texas Handyman Services crew on a Longview job site"
            wrapperClassName="aspect-[4/3] w-full rounded-lg border border-border"
            className="size-full object-cover"
          />
        </div>
      </section>

      <section className="bg-secondary/40 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Our History</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">From Weekend Repairs to a Full-Time Crew</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {history.map((item) => (
              <li key={item.year} className="rounded-lg border border-border bg-card p-6">
                <span className="font-display text-2xl text-brand">{item.year}</span>
                <h3 className="mt-3 text-base text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="eyebrow">Our Mission</p>
              <p className="mt-4 text-lg leading-relaxed text-card-foreground">{mission.mission}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="eyebrow">Our Vision</p>
              <p className="mt-4 text-lg leading-relaxed text-card-foreground">{mission.vision}</p>
            </div>
          </div>

          <h2 className="mt-16 text-3xl text-foreground sm:text-4xl">Core Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-lg border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base text-card-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Credentials</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">
            Licensing, Insurance & Safety Standards
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {certifications.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="flex gap-4 rounded-lg border border-border bg-card p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base text-card-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-secondary/50 p-8">
            <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
              Safety Standards on Every Job
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {safetyStandards.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Meet the Team</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">The People Who Show Up at Your Door</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              >
                <SmartImage
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  wrapperClassName="aspect-[4/3] w-full"
                  className="size-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-base text-card-foreground">{member.name}</h3>
                  <p className="font-display text-xs uppercase tracking-wider text-brand">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {member.specialties.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-secondary px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
    </SiteLayout>
  );
}
