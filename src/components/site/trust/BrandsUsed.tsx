import { Package } from "lucide-react";
import { brands } from "./trust-data";

/** Trusted brands, tools and materials with supplier context. */
export function BrandsUsed() {
  return (
    <section id="brands" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Brands & Materials</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">
            Professional-Grade Tools and Materials
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We buy from local East Texas suppliers and install brands that carry real manufacturer
            warranties — no bargain-bin substitutions.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-300 hover:border-brand/50"
            >
              <span className="flex size-10 items-center justify-center rounded-md bg-brand/15 text-brand">
                <Package className="size-5" />
              </span>
              <p className="mt-4 font-display text-base text-foreground">{brand.name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-brand">{brand.category}</p>
              <p className="mt-3 text-xs text-muted-foreground">Supplied by {brand.supplier}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Brand names are the property of their respective owners and are listed to describe the
          products we commonly install.
        </p>
      </div>
    </section>
  );
}
