import {
  BadgeCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { credentials, guarantees, trustStats, warranty } from "./trust-data";
import { useCountUp } from "./useCountUp";
import { useBooking } from "../booking/BookingProvider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const credentialIcons: Record<string, LucideIcon> = {
  licensed: BadgeCheck,
  insured: ShieldCheck,
  vetted: UserCheck,
  local: MapPin,
};

function StatCard({
  value,
  suffix,
  label,
  description,
}: {
  value: number;
  suffix: string;
  label: string;
  description: string;
}) {
  const { ref, value: current } = useCountUp(value);
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-lg border border-steel-foreground/15 bg-steel-foreground/5 p-7 glass-dark"
    >
      <p className="font-display text-4xl text-brand sm:text-5xl">
        <span ref={ref}>{current.toLocaleString()}</span>
        {suffix}
      </p>
      <p className="mt-3 font-display text-sm uppercase tracking-widest text-steel-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-steel-foreground/70">{description}</p>
    </motion.div>
  );
}

/** Credential badges + animated business counters. */
export function TrustBadges() {
  const { data: dbStats } = useQuery({
    queryKey: ["trust-stats"],
    queryFn: async () => {
      const { data } = await (supabase.from("trust_stats" as any) as any).select("*");
      return data || [];
    }
  });

  const statsToRender = dbStats?.length ? dbStats : trustStats;

  return (
    <section id="trust" className="surface-dark py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Homeowners Trust Us</p>
          <h2 className="mt-4 text-3xl text-steel-foreground sm:text-4xl lg:text-5xl">
            Licensed, Insured and Locally Accountable
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((item) => {
            const Icon = credentialIcons[item.id] ?? ShieldCheck;
            return (
              <div
                key={item.id}
                className="flex h-full flex-col rounded-lg border border-steel-foreground/15 bg-steel-foreground/5 p-7 transition-colors duration-300 hover:border-brand/50"
              >
                <span className="flex size-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
                  <Icon className="size-5" />
                </span>
                <p className="mt-5 font-display text-lg text-steel-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel-foreground/70">{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsToRender.map((stat: any) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Satisfaction guarantee cards + workmanship warranty detail. */
export function GuaranteeWarranty() {
  const { open } = useBooking();

  return (
    <section id="guarantee" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Our Promise</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">
            Satisfaction Guarantee & Workmanship Warranty
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Straightforward commitments, in writing, on every job we take on across East Texas.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col rounded-lg border border-border bg-card p-7 transition-colors duration-300 hover:border-brand/50"
            >
              <span className="flex size-11 items-center justify-center rounded-md bg-brand/15 text-brand">
                <Sparkles className="size-5" />
              </span>
              <p className="mt-5 font-display text-lg">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 rounded-lg border border-border bg-card p-7 lg:grid-cols-2 lg:p-10">
          <div>
            <span className="flex size-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <h3 className="mt-5 text-2xl">{warranty.headline}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{warranty.intro}</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{warranty.notes}</p>
            <Button variant="brand" size="lg" className="mt-6" onClick={() => open("estimate")}>
              Get a Written Estimate
            </Button>
          </div>
          <div>
            <p className="font-display text-sm uppercase tracking-widest text-brand">
              What the warranty covers
            </p>
            <ul className="mt-4 space-y-2.5">
              {warranty.covered.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}