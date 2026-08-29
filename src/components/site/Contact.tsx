import { useState, type FormEvent, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, CheckCircle2, Clock, Loader2, MapPin, MessageSquare, Navigation, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoBackdrop } from "./VideoBackdrop";
import { business, serviceAreas } from "./business";
import { PhotoUpload, type UploadedPhoto } from "./booking/PhotoUpload";
import { serviceCatalog, makeBookingId } from "./booking/pricing";
import { useBooking } from "./booking/BookingProvider";
import { submitBooking } from "@/lib/booking.functions";
import { cn } from "@/lib/utils";
import { contactVideoUrl } from "@/content/media";

const contactMethods = ["Phone call", "Text message", "Email"] as const;

export function Estimate() {
  const { open } = useBooking();
  const [service, setService] = useState("");
  const [contactMethod, setContactMethod] = useState<string>("Phone call");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      details: String(data.get("details") ?? "").trim(),
    };

    const nextErrors: Record<string, string> = {};
    if (values.name.length < 2) nextErrors["name"] = "Please enter your full name.";
    if (values.phone.replace(/\D/g, "").length < 10)
      nextErrors["phone"] = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
      nextErrors["email"] = "Please enter a valid email address.";
    if (values.address.length < 6) nextErrors["address"] = "Please enter the property address.";
    if (!service) nextErrors["service"] = "Please choose a service.";
    if (values.details.length < 10)
      nextErrors["details"] = "Tell us a little more about the project.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please check the highlighted fields");
      return;
    }

    setSubmitting(true);
    const id = makeBookingId();
    try {
      await submitBooking({
        data: {
          bookingId: id,
          requestType: "Free Estimate Request",
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          services: [service],
          propertyType: "Residential",
          urgency: "Standard",
          notes: values.details,
          photoCount: photos.length,
          preferredContact: contactMethod,
        },
      });
    } catch {
      // Fall through — the customer still gets confirmation and can call us.
    }
    setSubmitting(false);
    setSentId(id);
    formEl.reset();
    setService("");
    setPhotos([]);
    toast.success("Estimate request sent", {
      description: `Reference ${id} — we'll follow up shortly to schedule your free estimate.`,
    });
  };

  return (
    <section id="estimate" className="relative isolate overflow-hidden py-24 lg:py-32 bg-steel">
      <VideoBackdrop
        src={contactVideoUrl}
        overlayClassName="bg-gradient-to-br from-steel/80 via-steel/60 to-steel/40"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="eyebrow">Free Estimates</p>
          <h2 className="mt-4 text-3xl text-steel-foreground sm:text-4xl lg:text-5xl">
            Request a Free Estimate
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-steel-foreground/80">
            Tell us what needs fixing and we'll get back to you with honest pricing and a realistic
            schedule. Serving Longview and surrounding East Texas communities.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="lg" onClick={() => open("booking")}>
              <CalendarCheck className="size-4" /> Book Service
            </Button>
            <Button variant="onDark" size="lg" onClick={() => open("inspection")}>
              <Search className="size-4" /> Schedule Inspection
            </Button>
          </div>

          <ul className="mt-10 space-y-5">
            <li className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-display text-sm uppercase tracking-widest text-steel-foreground/60">
                  Phone
                </p>
                <a
                  href={business.phoneHref}
                  className="text-lg text-steel-foreground transition-colors hover:text-brand"
                >
                  {business.phone}
                </a>
                <a
                  href={business.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-2 text-sm text-steel-foreground/75 transition-colors hover:text-brand"
                >
                  <MessageSquare className="size-4" /> Message us on WhatsApp
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-display text-sm uppercase tracking-widest text-steel-foreground/60">
                  Address
                </p>
                <a
                  href={business.mapsDirections}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg leading-snug text-steel-foreground transition-colors hover:text-brand"
                >
                  {business.street}
                  <br />
                  {business.city}, {business.state} {business.zip}
                  <br />
                  {business.country}
                </a>
                <a
                  href={business.mapsDirections}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-2 text-sm text-steel-foreground/75 transition-colors hover:text-brand"
                >
                  <Navigation className="size-4" /> Tap for directions
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-display text-sm uppercase tracking-widest text-steel-foreground/60">
                  Hours
                </p>
                <p className="text-lg text-steel-foreground">{business.hours}</p>
              </div>
            </li>
          </ul>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-steel-foreground/15 bg-card/95 p-7 shadow-depth sm:p-9 glass border-white/10"
        >
          {sentId ? (
            <div className="animate-fade-up space-y-5 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15">
                <CheckCircle2 className="size-7 text-brand" />
              </span>
              <h3 className="font-display text-2xl uppercase tracking-wide text-card-foreground">
                Request received
              </h3>
              <p className="text-sm text-muted-foreground">
                Reference <span className="font-semibold text-foreground">{sentId}</span>. A
                confirmation email is on its way and we'll call to schedule your free estimate.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="brand" size="lg" asChild className="sm:flex-1">
                  <a href={business.phoneHref}>
                    <Phone className="size-4" /> Call {business.phone}
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="sm:flex-1" onClick={() => setSentId(null)}>
                  Send another request
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl text-card-foreground">Get Your Free Quote</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No obligation. Most requests answered the same business day.
              </p>

              <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Full name" error={errors["name"]}>
                    <Input id="name" name="name" placeholder="Jane Doe" />
                  </Field>
                  <Field id="phone" label="Phone" error={errors["phone"]}>
                    <Input id="phone" name="phone" type="tel" placeholder="(903) 555-0134" />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="email" label="Email" error={errors["email"]}>
                    <Input id="email" name="email" type="email" placeholder="you@email.com" />
                  </Field>
                  <Field id="address" label="Property address" error={errors["address"]}>
                    <Input id="address" name="address" placeholder="123 Pine St, Longview, TX" />
                  </Field>
                </div>

                <Field id="service" label="Service needed" error={errors["service"]}>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCatalog.map((option) => (
                        <SelectItem key={option.id} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="details" label="Project description" error={errors["details"]}>
                  <Textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder="Tell us about the repair, installation, or maintenance you need."
                  />
                </Field>

                <div className="space-y-2">
                  <Label>Project photos (optional)</Label>
                  <PhotoUpload photos={photos} onChange={setPhotos} max={6} />
                </div>

                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {contactMethods.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setContactMethod(method)}
                        className={cn(
                          "rounded-md border px-3.5 py-2.5 text-sm transition-colors",
                          contactMethod === method
                            ? "border-brand bg-brand/10 text-foreground"
                            : "border-border bg-card text-card-foreground hover:border-brand/50",
                        )}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  size="xl"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Request Free Estimate"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Prefer to talk it through? Call{" "}
                  <a href={business.phoneHref} className="font-semibold text-foreground underline">
                    {business.phone}
                  </a>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ServiceArea() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={ref} id="area" className="py-24 lg:py-32 relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--brand)_0%,transparent_70%)]" />
      </motion.div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="eyebrow">Service Area</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">
            Proudly Serving Longview and Surrounding East Texas
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Based at {business.street} in {business.city}, we travel throughout the region for
            residential and light commercial repair, maintenance, and improvement work. Not sure if
            you're in range? Give us a call — we'll let you know right away.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-card-foreground"
              >
                {area}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="brand" size="xl" asChild>
              <a href={business.mapsDirections} target="_blank" rel="noreferrer">
                <Navigation className="size-4" /> Get Directions
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href={business.phoneHref}>
                <Phone className="size-4" /> {business.phone}
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href={business.whatsappHref} target="_blank" rel="noreferrer">
                <MessageSquare className="size-4" /> Message Us
              </a>
            </Button>
          </div>
        </div>

        <MapEmbed />

      </div>
    </section>
  );
}

/** Google Map embed with a shimmering skeleton until the frame finishes loading. */
function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border shadow-lg">
      {!loaded && <div aria-hidden="true" className="skeleton-shimmer absolute inset-0" />}
      <iframe
        title={`Google Map showing ${business.name} at ${business.addressLine}`}
        src={business.mapsEmbed}
        className={`h-[420px] w-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
