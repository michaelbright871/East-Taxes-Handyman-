import { Hammer, MapPin, Navigation, Phone } from "lucide-react";
import { business, serviceAreas } from "./business";

const services = [
  "General Home Repairs",
  "Carpentry",
  "Drywall Repair",
  "Interior & Exterior Painting",
  "Door Installation & Repair",
  "Window Repair",
  "Flooring Repairs",
  "Fence & Deck Repair",
  "Pressure Washing",
  "Home Maintenance",
];

export function SiteFooter() {
  return (
    <footer className="surface-chrome border-t border-surface-foreground/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Hammer className="size-5" />
            </span>
            <span className="font-display text-lg uppercase tracking-wide">{business.name}</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-surface-foreground/70">
            Reliable residential and light commercial handyman services in Longview, Texas. Honest
            pricing, quality craftsmanship, and projects finished on time — every job, every time.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <a
              href={business.phoneHref}
              className="flex items-center gap-2 text-surface-foreground transition-colors hover:text-brand"
            >
              <Phone className="size-4 text-brand" /> {business.phone}
            </a>
            <p className="flex items-start gap-2 text-surface-foreground/75">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              {business.street}, {business.city}, {business.state} {business.zip},{" "}
              {business.country}
            </p>
            <a
              href={business.mapsDirections}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-surface-foreground transition-colors hover:text-brand"
            >
              <Navigation className="size-4 text-brand" /> Get directions on Google Maps
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand">Services</h3>
          <ul className="mt-5 space-y-2 text-sm text-surface-foreground/70">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand">
            Service Area
          </h3>
          <ul className="mt-5 space-y-2 text-sm text-surface-foreground/70">
            {serviceAreas.slice(0, 8).map((area) => (
              <li key={area}>{area}, TX</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-surface-foreground/60">{business.hours}</p>
        </div>
      </div>

      <div className="border-t border-surface-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-surface-foreground/55 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p>Longview, Texas · Residential &amp; Light Commercial Handyman Services</p>
        </div>
      </div>
    </footer>
  );
}
