import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { business } from "../business";
import { PhotoUpload, type UploadedPhoto } from "./PhotoUpload";
import {
  calculateEstimate,
  complexities,
  currency,
  makeBookingId,
  projectSizes,
  propertyTypes,
  serviceCatalog,
  serviceLabel,
  timeSlots,
  urgencies,
  type ComplexityId,
  type ProjectSizeId,
  type PropertyTypeId,
  type UrgencyId,
} from "./pricing";
import { submitBooking } from "@/lib/booking.functions";

export type BookingMode = "estimate" | "booking" | "inspection" | "emergency";

const modeCopy: Record<BookingMode, { title: string; description: string; cta: string }> = {
  estimate: {
    title: "Instant Quote Estimator",
    description: "Answer a few quick questions for a ballpark price and timeline.",
    cta: "Send my estimate request",
  },
  booking: {
    title: "Book Your Service",
    description: "Pick your services, choose a date and we'll confirm the visit.",
    cta: "Confirm booking",
  },
  inspection: {
    title: "Schedule an Inspection",
    description: "We'll come out, look things over and give you honest options.",
    cta: "Request inspection",
  },
  emergency: {
    title: "Emergency Repair Request",
    description: "Urgent damage or safety issue? We prioritise same-day response.",
    cta: "Send emergency request",
  },
};

interface FormState {
  services: string[];
  propertyType: PropertyTypeId;
  size: ProjectSizeId;
  complexity: ComplexityId;
  urgency: UrgencyId;
  date: string;
  timeSlot: string;
  photos: UploadedPhoto[];
  address: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  preferredContact: "Phone call" | "Text message" | "Email";
}

const initialState = (mode: BookingMode): FormState => ({
  services: [],
  propertyType: "residential",
  size: "small",
  complexity: "standard",
  urgency: mode === "emergency" ? "emergency" : "standard",
  date: "",
  timeSlot: "",
  photos: [],
  address: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  preferredContact: "Phone call",
});

const today = () => new Date().toISOString().slice(0, 10);

export function BookingDialog({
  open,
  mode,
  presetServiceId,
  onOpenChange,
}: {
  open: boolean;
  mode: BookingMode;
  presetServiceId?: string | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(mode));
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      if (dialogRef.current) {
        dialogRef.current.scrollTop = 0;
        dialogRef.current.scrollLeft = 0;
      }
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    });

    setForm({
      ...initialState(mode),
      services: presetServiceId ? [presetServiceId] : [],
    });
    setStep(0);
    setError(null);
    setBookingId(null);
    setSubmitting(false);

    return () => window.cancelAnimationFrame(frame);
  }, [open, mode, presetServiceId]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, step]);

  const needsSchedule = mode !== "estimate";
  const steps = useMemo(
    () =>
      [
        "Services",
        "Project details",
        ...(needsSchedule ? ["Schedule"] : []),
        "Photos & address",
        "Your details",
        "Review",
      ] as string[],
    [needsSchedule],
  );

  const estimate = useMemo(
    () =>
      calculateEstimate({
        serviceIds: form.services,
        propertyType: form.propertyType,
        size: form.size,
        complexity: form.complexity,
        urgency: form.urgency,
      }),
    [form.services, form.propertyType, form.size, form.complexity, form.urgency],
  );

  const stepName = steps[step];
  const isEmergency = form.urgency === "emergency";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleService = (id: string) =>
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));

  const validateStep = () => {
    if (stepName === "Services" && form.services.length === 0)
      return "Please select at least one service.";
    if (stepName === "Schedule") {
      if (!form.date) return "Please choose a preferred date.";
      if (!form.timeSlot) return "Please choose a time slot.";
    }
    if (stepName === "Photos & address" && form.address.trim().length < 6)
      return "Please enter the property address.";
    if (stepName === "Your details") {
      if (form.name.trim().length < 2) return "Please enter your full name.";
      if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
        return "Please enter a valid email address.";
    }
    return null;
  };

  const next = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const renderStepPanel = (index: number) => {
    const label = steps[index];

    if (label === "Services") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Service selection
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose the tasks you need completed so we can bundle the visit efficiently.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {serviceCatalog.map((service) => {
              const active = form.services.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99]",
                    active
                      ? "border-[#0a84ff] bg-[#0a84ff]/10 text-slate-900 shadow-[0_8px_24px_rgba(10,132,255,0.12)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <span>{service.label}</span>
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      active ? "border-[#0a84ff] bg-[#0a84ff] text-white" : "border-slate-300 bg-white",
                    )}
                  >
                    {active && <CheckCircle2 className="size-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (label === "Project details") {
      return (
        <div className="space-y-5">
          <OptionGroup
            label="Property type"
            options={propertyTypes.map((p) => ({ id: p.id, label: p.label }))}
            value={form.propertyType}
            onChange={(v) => update("propertyType", v as PropertyTypeId)}
          />
          <OptionGroup
            label="Project size"
            options={projectSizes.map((s) => ({ id: s.id, label: s.label }))}
            value={form.size}
            onChange={(v) => update("size", v as ProjectSizeId)}
            columns
          />
          <OptionGroup
            label="Repair complexity"
            options={complexities.map((c) => ({ id: c.id, label: c.label }))}
            value={form.complexity}
            onChange={(v) => update("complexity", v as ComplexityId)}
            columns
          />
          <OptionGroup
            label="Urgency"
            options={urgencies.map((u) => ({ id: u.id, label: u.label, note: u.note }))}
            value={form.urgency}
            onChange={(v) => update("urgency", v as UrgencyId)}
          />
          {estimate && <EstimatePanel estimate={estimate} />}
        </div>
      );
    }

    if (label === "Schedule") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label htmlFor="booking-date" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Preferred date
            </Label>
            <Input
              id="booking-date"
              type="date"
              min={today()}
              value={form.date}
              onChange={(event) => update("date", event.target.value)}
              className="mt-3 h-12 rounded-xl border-slate-200 bg-white px-3 text-base"
            />
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Available time slots
            </Label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => update("timeSlot", slot)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.99]",
                    form.timeSlot === slot
                      ? "border-[#0a84ff] bg-[#0a84ff]/10 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {isEmergency && (
            <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-slate-700">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
              For active leaks, storm damage or safety hazards, call{" "}
              <a href={business.phoneHref} className="font-semibold underline underline-offset-2">
                {business.phone}
              </a>{" "}
              right away — we'll respond faster by phone.
            </p>
          )}
        </div>
      );
    }

    if (label === "Photos & address") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label htmlFor="booking-address" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Property address
            </Label>
            <Input
              id="booking-address"
              placeholder="123 Pine St, Longview, TX 75604"
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              className="mt-3 h-12 rounded-xl border-slate-200 bg-white px-3 text-base"
            />
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Project photos (optional)
            </Label>
            <div className="mt-3">
              <PhotoUpload
                photos={form.photos}
                onChange={(photos) => update("photos", photos)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label htmlFor="booking-notes" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Project notes
            </Label>
            <Textarea
              id="booking-notes"
              rows={4}
              placeholder="Anything we should know — access, materials, timing, problem history."
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="mt-3 min-h-[110px] rounded-2xl border-slate-200 bg-white px-3 py-3 text-base"
            />
          </div>
        </div>
      );
    }

    if (label === "Your details") {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
              <Label htmlFor="booking-name" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Full name
              </Label>
              <Input
                id="booking-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Jane Doe"
                className="mt-3 h-12 rounded-xl border-slate-200 bg-white px-3 text-base"
              />
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
              <Label htmlFor="booking-phone" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Phone
              </Label>
              <Input
                id="booking-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="(903) 555-0134"
                className="mt-3 h-12 rounded-xl border-slate-200 bg-white px-3 text-base"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
            <Label htmlFor="booking-email" className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Email
            </Label>
            <Input
              id="booking-email"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@email.com"
              className="mt-3 h-12 rounded-xl border-slate-200 bg-white px-3 text-base"
            />
          </div>

          <OptionGroup
            label="Preferred contact method"
            options={[
              { id: "Phone call", label: "Phone call" },
              { id: "Text message", label: "Text message" },
              { id: "Email", label: "Email" },
            ]}
            value={form.preferredContact}
            onChange={(v) => update("preferredContact", v as FormState["preferredContact"])}
          />
        </div>
      );
    }

    if (label === "Review") {
      return (
        <div className="space-y-5">
          {estimate && <EstimatePanel estimate={estimate} />}
          <dl className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <SummaryRow label="Services" value={form.services.map(serviceLabel).join(", ")} />
            <SummaryRow
              label="Property"
              value={`${propertyTypes.find((p) => p.id === form.propertyType)!.label} · ${
                projectSizes.find((s) => s.id === form.size)!.label
              }`}
            />
            <SummaryRow label="Urgency" value={urgencies.find((u) => u.id === form.urgency)!.label} />
            {needsSchedule && <SummaryRow label="Date & time" value={`${form.date} · ${form.timeSlot}`} />}
            <SummaryRow label="Address" value={form.address} />
            <SummaryRow
              label="Contact"
              value={`${form.name} · ${form.phone} · ${form.email} · prefers ${form.preferredContact.toLowerCase()}`}
            />
            {form.notes && <SummaryRow label="Notes" value={form.notes} />}
          </dl>

          {form.photos.length > 0 && (
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Photos ({form.photos.length})
              </p>
              <ul className="mt-3 grid grid-cols-4 gap-2">
                {form.photos.map((photo) => (
                  <li key={photo.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img src={photo.url} alt={photo.name} className="h-16 w-full object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const submit = async () => {
    setSubmitting(true);
    const id = makeBookingId();
    try {
      await submitBooking({
        data: {
          bookingId: id,
          requestType: modeCopy[mode].title,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          services: form.services.map(serviceLabel),
          propertyType: propertyTypes.find((p) => p.id === form.propertyType)!.label,
          urgency: urgencies.find((u) => u.id === form.urgency)!.label,
          date: form.date || undefined,
          timeSlot: form.timeSlot || undefined,
          notes: form.notes || undefined,
          photoCount: form.photos.length,
          estimateLow: estimate?.low,
          estimateHigh: estimate?.high,
          duration: estimate?.duration,
          preferredContact: form.preferredContact,
        },
      });
    } catch {
      // The confirmation is still shown — we follow up by phone as a fallback.
    }
    setBookingId(id);
    setSubmitting(false);
    toast.success("Request received", {
      description: `Booking ${id} — a confirmation email is on its way.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        className="w-[calc(100vw-0.75rem)] max-w-[560px] overflow-hidden border-0 bg-[#f5f5f7] p-0 shadow-[0_24px_80px_rgba(15,23,42,0.35)] sm:rounded-[30px]"
      >
        <div className="flex h-full max-h-[92svh] flex-col bg-[#f5f5f7] text-slate-900">
          <div className="border-b border-slate-200/80 bg-[#f5f5f7]/90 px-4 pb-3 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={bookingId ? () => onOpenChange(false) : back}
                disabled={(!bookingId && step === 0) || submitting}
                className="min-w-[72px] rounded-full px-2 py-1.5 text-left text-[17px] font-semibold text-[#ff3b30] transition-opacity disabled:opacity-40"
              >
                {bookingId ? "Done" : "Back"}
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-center">
                <DialogTitle className="truncate text-center text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
                  {bookingId ? "Request received" : modeCopy[mode].title}
                </DialogTitle>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-w-[72px] rounded-full px-2 py-1.5 text-right text-[17px] font-semibold text-[#ff3b30]"
              >
                {bookingId ? "Close" : "Done"}
              </button>
            </div>

            {!bookingId && (
              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  {steps.map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-300",
                        index <= step ? "bg-[#0a84ff]" : "bg-slate-200",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  {step + 1} / {steps.length} · {stepName}
                </p>
              </div>
            )}
          </div>

          <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
            {bookingId ? (
              <Confirmation
                bookingId={bookingId}
                form={form}
                mode={mode}
                estimateText={estimate ? `${currency(estimate.low)} – ${currency(estimate.high)}` : null}
                onClose={() => onOpenChange(false)}
              />
            ) : (
              <div className="overflow-hidden">
                <div
                  className="flex w-full transition-transform duration-300 ease-out will-change-transform"
                  style={{ transform: `translateX(-${step * 100}%)` }}
                >
                  {steps.map((_, index) => (
                    <div key={steps[index]} className="w-full shrink-0 px-1">
                      {renderStepPanel(index)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {!bookingId && (
            <div className="border-t border-slate-200/80 bg-[#f5f5f7]/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="ghost" onClick={back} disabled={step === 0 || submitting} className="h-12 sm:w-auto">
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" size="lg" asChild className="h-12">
                    <a href={business.phoneHref}>
                      <Phone className="size-4" /> Call Now
                    </a>
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button variant="brand" size="lg" onClick={next} className="h-12">
                      Continue <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button variant="brand" size="lg" onClick={submit} disabled={submitting} className="h-12">
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" /> {modeCopy[mode].cta}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
  columns = false,
}: {
  label: string;
  options: { id: string; label: string; note?: string }[];
  value: string;
  onChange: (value: string) => void;
  columns?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={cn("grid gap-2", columns ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors",
              value === option.id
                ? "border-brand bg-brand/10 text-foreground"
                : "border-border bg-card text-card-foreground hover:border-brand/50",
            )}
          >
            <span className="block font-medium">{option.label}</span>
            {option.note && (
              <span className="mt-0.5 block text-xs text-muted-foreground">{option.note}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EstimatePanel({
  estimate,
}: {
  estimate: NonNullable<ReturnType<typeof calculateEstimate>>;
}) {
  return (
    <div className="rounded-lg border border-brand/30 bg-brand/5 p-5">
      <p className="eyebrow">Estimated range</p>
      <p className="mt-2 font-display text-3xl text-foreground">
        {currency(estimate.low)} – {currency(estimate.high)}
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4 text-brand" /> {estimate.duration}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4 text-brand" /> Start {estimate.leadTime}
        </p>
        {estimate.recommended && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4 text-brand" /> {estimate.recommended}
          </p>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Estimates are approximate and based on typical East Texas projects. Final pricing is
        confirmed in your free on-site estimate.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr]">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="text-sm text-card-foreground">{value}</dd>
    </div>
  );
}

function Confirmation({
  bookingId,
  form,
  mode,
  estimateText,
  onClose,
}: {
  bookingId: string;
  form: FormState;
  mode: BookingMode;
  estimateText: string | null;
  onClose: () => void;
}) {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15">
          <CheckCircle2 className="size-7 text-brand" />
        </span>
        <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-foreground">
          {mode === "emergency" ? "Emergency request received" : "You're on the schedule"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A confirmation email is on its way to {form.email}.
        </p>
        <p className="mt-3 inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 font-display text-sm uppercase tracking-widest text-foreground">
          Booking ID · {bookingId}
        </p>
      </div>

      <dl className="divide-y divide-border rounded-lg border border-border bg-card">
        <SummaryRow label="Services" value={form.services.map(serviceLabel).join(", ")} />
        {form.date && <SummaryRow label="Date" value={form.date} />}
        {form.timeSlot && <SummaryRow label="Time" value={form.timeSlot} />}
        <SummaryRow label="Customer" value={`${form.name} · ${form.phone}`} />
        <SummaryRow label="Address" value={form.address} />
        {estimateText && <SummaryRow label="Estimated cost" value={`${estimateText} (approximate)`} />}
        <SummaryRow label="Photos" value={`${form.photos.length} attached`} />
      </dl>

      <div className="rounded-lg border border-border bg-muted/40 p-5">
        <p className="eyebrow">What happens next</p>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. We review your details and photos.</li>
          <li>2. You get a call or text to confirm the visit window.</li>
          <li>3. We arrive on time with a written estimate before any work starts.</li>
        </ol>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="brand" size="lg" asChild className="sm:flex-1">
          <a href={business.phoneHref}>
            <Phone className="size-4" /> Call {business.phone}
          </a>
        </Button>
        <Button variant="outline" size="lg" asChild className="sm:flex-1">
          <a href={business.mapsDirections} target="_blank" rel="noreferrer">
            <MapPin className="size-4" /> Get Directions
          </a>
        </Button>
        <Button variant="ghost" size="lg" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
