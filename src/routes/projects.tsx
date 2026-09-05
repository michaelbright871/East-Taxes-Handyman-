import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { carpentryVideoUrl } from "@/content/media";
import { SmartImage } from "@/components/site/SmartImage";
import { BrochureCTA, HowItWorks } from "@/components/site/content/ContentSections";
import { featuredProjects, recentJobs } from "@/content/company";

const TITLE = "Recent Handyman Projects in East Texas | Our Work";
const DESCRIPTION =
  "See recent handyman projects completed across Longview, Kilgore, Gladewater, Tyler and Hallsville — before-and-after case studies with challenge, solution and result.";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
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

function ProjectsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Work"
        title="Featured Projects & Recently Completed Jobs"
        intro="Real projects from real East Texas properties — what the problem was, how we solved it, and how it turned out."
        video={carpentryVideoUrl}
        crumb={[{ label: "Projects", to: "/projects" }]}
      />

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Featured Projects</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">Case Studies From Around East Texas</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
              >
                <SmartImage
                  src={project.image}
                  alt={`${project.title} in ${project.location}`}
                  wrapperClassName="aspect-[16/10] w-full"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-display text-xs uppercase tracking-wider text-brand">
                    {project.category}
                  </span>
                  <h3 className="mt-2 text-lg text-card-foreground">{project.title}</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                        Challenge
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{project.challenge}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                        Solution
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{project.solution}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                        Result
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{project.result}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-brand" /> {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-brand" /> {project.duration}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Recent Jobs</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">What We've Been Working On Lately</h2>
          <ul className="mt-10 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {recentJobs.map((job) => (
              <li key={job.title} className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base text-card-foreground">{job.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{job.blurb}</p>
                </div>
                <div className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground sm:text-right">
                  <span className="block text-brand">{job.location}</span>
                  {job.date}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HowItWorks />
      <BrochureCTA />
    </SiteLayout>
  );
}
