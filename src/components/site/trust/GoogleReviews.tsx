import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleBusiness } from "./trust-data";
import { GoogleMark, StarRating } from "./TrustPrimitives";
import { ReviewCarousel } from "./ReviewCarousel";
import { business } from "../business";
import { motion } from "framer-motion";
import { PerspectiveCard } from "../effects/PerspectiveCard";

/** Google rating summary, star breakdown and review carousel. */
export function GoogleReviews() {
  const total = googleBusiness.distribution.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <section id="google-reviews" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Google Reviews</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">
            Rated {googleBusiness.rating} Stars by East Texas Neighbours
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Verified reviews collected on our Google Business Profile — updated automatically as new
            customers share their experience.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
          {/* Rating summary */}
          <PerspectiveCard>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="min-w-0 rounded-lg border border-border bg-card p-7 glass-dark shadow-depth"
            >
            <div className="flex items-center gap-3">
              <GoogleMark />
              <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                Google Rating
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-6xl leading-none text-foreground">
                {googleBusiness.rating.toFixed(1)}
              </span>
              <div className="pb-1">
                <StarRating rating={googleBusiness.rating} starClassName="size-5" />
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {googleBusiness.totalReviews} reviews
                </p>
              </div>
            </div>

            <dl className="mt-7 space-y-2">
              {googleBusiness.distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <dt className="w-10 shrink-0 text-xs text-muted-foreground">{row.stars} star</dt>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-700"
                      style={{ width: `${(row.count / total) * 100}%` }}
                    />
                  </div>
                  <dd className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {row.count}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 rounded-md bg-brand/10 p-4">
              <p className="font-display text-3xl text-brand">{googleBusiness.satisfaction}%</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Average customer satisfaction
              </p>
            </div>

            <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">
              <p className="font-display text-base text-foreground">{business.name}</p>
              <p className="mt-1">{business.addressLine}</p>
              <p>{business.hours}</p>
            </div>

            <Button variant="brand" size="lg" className="mt-6 w-full" asChild>
              <a href={googleBusiness.profileUrl} target="_blank" rel="noreferrer noopener">
                View All Reviews on Google <ExternalLink className="size-4" />
              </a>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Source: Google Business Profile
            </p>
            </motion.div>
          </PerspectiveCard>
          
          {/* Carousel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="min-w-0"
          >
            <ReviewCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
