import { ArrowRight, CheckCircle2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customerStories } from "./trust-data";
import { useBooking } from "../booking/BookingProvider";

/** Featured customer success stories: problem → solution → work → outcome. */
export function CustomerStories() {
  const { open } = useBooking();

  return (
    <section id="stories" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Featured Customer Stories</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">
            Real Projects, Start to Finish
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A closer look at how we scope, price and complete work for East Texas homeowners and
            property managers.
          </p>
        </div>

        <div className="mt-14 space-y-6">
          {customerStories.map((story) => (
            <article
              key={story.id}
              className="rounded-lg border border-border bg-card p-7 transition-colors duration-300 hover:border-brand/50 lg:p-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-brand/15 text-brand">
                  <Wrench className="size-5" />
                </span>
                <h3 className="text-xl sm:text-2xl">{story.title}</h3>
              </div>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {story.customer} · {story.location}
              </p>

              <div className="mt-7 grid gap-7 lg:grid-cols-3">
                <div>
                  <p className="font-display text-sm uppercase tracking-widest text-brand">
                    The Problem
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.problem}</p>
                </div>
                <div>
                  <p className="font-display text-sm uppercase tracking-widest text-brand">
                    Our Solution
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.solution}</p>
                </div>
                <div>
                  <p className="font-display text-sm uppercase tracking-widest text-brand">
                    Work Completed
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {story.work.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 grid gap-5 border-t border-border pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <blockquote className="text-sm italic leading-relaxed text-foreground">
                  {story.feedback}
                </blockquote>
                <p className="font-display text-sm uppercase tracking-widest text-brand lg:text-right">
                  {story.outcome}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button variant="brand" size="xl" onClick={() => open("estimate")}>
            Start Your Project <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="xl" onClick={() => open("inspection")}>
            Schedule Inspection
          </Button>
        </div>
      </div>
    </section>
  );
}
