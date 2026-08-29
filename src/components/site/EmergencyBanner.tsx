import { AlertTriangle, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { business } from "./business";
import { useBooking } from "./booking/BookingProvider";

/** Highlighted emergency repair banner — same design language, urgent accent. */
export function EmergencyBanner() {
  const { open } = useBooking();

  return (
    <section aria-label="Emergency repair service" className="bg-destructive/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <p className="font-display text-sm uppercase tracking-widest text-destructive">
              Emergency Repairs
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              Storm damage, broken doors, water damage or a safety hazard? We prioritise urgent
              repairs with same-day response across Longview and East Texas.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Button variant="brand" size="lg" onClick={() => open("emergency")}>
            Emergency Booking
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={business.phoneHref}>
              <Phone className="size-4" /> Call Now
            </a>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <a href={business.whatsappHref} target="_blank" rel="noreferrer">
              <MessageSquare className="size-4" /> Message Us
            </a>

          </Button>
        </div>
      </div>
    </section>
  );
}
