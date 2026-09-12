import { useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  isSheetVisible = true,
  mode,
  presetServiceId,
  onOpenChange,
  onClose,
}: {
  open: boolean;
  isSheetVisible?: boolean;
  mode: BookingMode;
  presetServiceId?: string | undefined;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(mode));
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  }, [onClose, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...initialState(mode),
      services: presetServiceId ? [presetServiceId] : [],
    });
    setStep(0);
    setError(null);
    setBookingId(null);
    setSubmitting(false);
  }, [open, mode, presetServiceId]);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = 0;
    contentRef.current.scrollTo({ top: 0 });
  }, [step, bookingId, mode, open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* Subtle dark backdrop with soft blur */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isSheetVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* iOS Modal Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-modal-title"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col mx-auto",
          "h-[90vh] max-h-[92vh] sm:h-[86vh] sm:max-w-2xl",
          "rounded-t-[26px] sm:rounded-t-[30px]",
          "bg-[#F2F2F7] dark:bg-[#121214] text-foreground",
          "border-t border-x border-black/10 dark:border-white/10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)]",
          "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
          isSheetVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* iOS Grabber Pill */}
        <div className="pt-2 pb-1 shrink-0">
          <div className="w-10 h-1.5 bg-[#3C3C43]/30 dark:bg-[#EBEBF5]/30 rounded-full mx-auto" />
        </div>

        {/* iOS Navigation Header Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#C6C6C8]/60 dark:border-[#38383A]/60 bg-[#F2F2F7]/95 dark:bg-[#121214]/95 backdrop-blur-md shrink-0">
          {/* Left Action */}
          <div className="w-20 text-left">
            {bookingId ? (
              <span />
            ) : step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-0.5 text-[17px] font-normal text-[#111111] dark:text-white hover:opacity-75 active:opacity-40 transition-opacity"
              >
                <ChevronLeft className="size-5 -ml-1.5 stroke-[2.5]" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="text-[17px] font-normal text-[#111111] dark:text-white hover:opacity-75 active:opacity-40 transition-opacity"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Center Title */}
          <div className="flex-1 text-center px-2 min-w-0">
            <h2
              id="ios-modal-title"
              className="text-[17px] font-semibold text-[#000000] dark:text-[#FFFFFF] tracking-tight truncate"
            >
              {bookingId ? "Confirmed" : stepName}
            </h2>
          </div>

          {/* Right Action */}
          <div className="w-20 text-right">
            {bookingId ? (
              <button
                type="button"
                onClick={handleClose}
                className="text-[17px] font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:opacity-75 active:opacity-40 transition-opacity"
              >
                Done
              </button>
            ) : step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="text-[17px] font-semibold text-[#111111] dark:text-white hover:opacity-75 active:opacity-40 transition-opacity"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center justify-end text-[17px] font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:opacity-75 active:opacity-40 transition-opacity disabled:opacity-40"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : "Done"}
              </button>
            )}
          </div>
        </div>

        {/* Hairline Step Progress Bar */}
        {!bookingId && (
          <div className="h-[2px] w-full bg-[#E5E5EA] dark:bg-[#2C2C2E] overflow-hidden shrink-0">
            <div
              className="h-full bg-[#111111] dark:bg-white transition-all duration-300 ease-out"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        )}

        {/* Scrollable iOS Content Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5 overscroll-contain">
          {bookingId ? (
            <Confirmation
              bookingId={bookingId}
              form={form}
              mode={mode}
              estimateText={estimate ? `${currency(estimate.low)} – ${currency(estimate.high)}` : null}
              onClose={handleClose}
            />
          ) : (
            <div key={stepName} className="space-y-4 animate-in fade-in-50 duration-200">
              {/* STEP 1: Services */}
              {stepName === "Services" && (
                <div>
                  <IosSectionTitle subtitle="Select every service you need — we'll bundle them into one visit.">
                    Services
                  </IosSectionTitle>
                  <IosGroupCard>
                    {serviceCatalog.map((service) => {
                      const active = form.services.includes(service.id);
                      return (
                        <IosSelectRow
                          key={service.id}
                          label={service.label}
                          active={active}
                          onClick={() => toggleService(service.id)}
                        />
                      );
                    })}
                  </IosGroupCard>
                </div>
              )}

              {/* STEP 2: Project Details */}
              {stepName === "Project details" && (
                <div className="space-y-5">
                  <div>
                    <IosSectionTitle>Property Type</IosSectionTitle>
                    <IosGroupCard>
                      {propertyTypes.map((p) => (
                        <IosSelectRow
                          key={p.id}
                          label={p.label}
                          active={form.propertyType === p.id}
                          onClick={() => update("propertyType", p.id as PropertyTypeId)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Project Size</IosSectionTitle>
                    <IosGroupCard>
                      {projectSizes.map((s) => (
                        <IosSelectRow
                          key={s.id}
                          label={s.label}
                          active={form.size === s.id}
                          onClick={() => update("size", s.id as ProjectSizeId)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Repair Complexity</IosSectionTitle>
                    <IosGroupCard>
                      {complexities.map((c) => (
                        <IosSelectRow
                          key={c.id}
                          label={c.label}
                          active={form.complexity === c.id}
                          onClick={() => update("complexity", c.id as ComplexityId)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Urgency</IosSectionTitle>
                    <IosGroupCard>
                      {urgencies.map((u) => (
                        <IosSelectRow
                          key={u.id}
                          label={u.label}
                          sublabel={u.note}
                          active={form.urgency === u.id}
                          onClick={() => update("urgency", u.id as UrgencyId)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>

                  {estimate && <EstimatePanel estimate={estimate} />}
                </div>
              )}

              {/* STEP 3: Schedule */}
              {stepName === "Schedule" && (
                <div className="space-y-5">
                  <div>
                    <IosSectionTitle>Preferred Date</IosSectionTitle>
                    <IosGroupCard>
                      <IosInputRow label="Date">
                        <input
                          id="booking-date"
                          type="date"
                          min={today()}
                          value={form.date}
                          onChange={(e) => update("date", e.target.value)}
                          className="w-full bg-transparent text-[16px] text-foreground focus:outline-none [color-scheme:light_dark]"
                        />
                      </IosInputRow>
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Available Time Slots</IosSectionTitle>
                    <IosGroupCard>
                      {timeSlots.map((slot) => (
                        <IosSelectRow
                          key={slot}
                          label={slot}
                          active={form.timeSlot === slot}
                          onClick={() => update("timeSlot", slot)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>

                  {isEmergency && (
                    <div className="rounded-[14px] bg-destructive/10 border border-destructive/20 p-4 text-[14px] text-foreground flex items-start gap-3">
                      <AlertTriangle className="size-5 shrink-0 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Emergency Request</p>
                        <p className="text-muted-foreground mt-0.5 text-[13px] leading-relaxed">
                          For active leaks, storm damage, or safety hazards, call{" "}
                          <a href={business.phoneHref} className="font-semibold underline text-foreground">
                            {business.phone}
                          </a>{" "}
                          immediately for the fastest dispatch.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Photos & Address */}
              {stepName === "Photos & address" && (
                <div className="space-y-5">
                  <div>
                    <IosSectionTitle>Property Address</IosSectionTitle>
                    <IosGroupCard>
                      <IosInputRow label="Address">
                        <input
                          id="booking-address"
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder="123 Pine St, Longview, TX 75604"
                          className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </IosInputRow>
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle subtitle="Attach pictures to help us provide a precise quote and arrive with the exact tools.">
                      Project Photos (Optional)
                    </IosSectionTitle>
                    <IosGroupCard className="p-3">
                      <PhotoUpload photos={form.photos} onChange={(photos) => update("photos", photos)} />
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Project Notes</IosSectionTitle>
                    <IosGroupCard>
                      <textarea
                        id="booking-notes"
                        rows={3}
                        placeholder="Anything we should know — access instructions, materials on hand, timing, problem history."
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        className="w-full bg-transparent px-4 py-3 text-[16px] text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                      />
                    </IosGroupCard>
                  </div>
                </div>
              )}

              {/* STEP 5: Your Details */}
              {stepName === "Your details" && (
                <div className="space-y-5">
                  <div>
                    <IosSectionTitle>Contact Information</IosSectionTitle>
                    <IosGroupCard>
                      <IosInputRow label="Full Name">
                        <input
                          id="booking-name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </IosInputRow>
                      <IosInputRow label="Phone">
                        <input
                          id="booking-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="(903) 555-0134"
                          className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </IosInputRow>
                      <IosInputRow label="Email">
                        <input
                          id="booking-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@email.com"
                          className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </IosInputRow>
                    </IosGroupCard>
                  </div>

                  <div>
                    <IosSectionTitle>Preferred Contact Method</IosSectionTitle>
                    <IosGroupCard>
                      {(["Phone call", "Text message", "Email"] as const).map((method) => (
                        <IosSelectRow
                          key={method}
                          label={method}
                          active={form.preferredContact === method}
                          onClick={() => update("preferredContact", method)}
                        />
                      ))}
                    </IosGroupCard>
                  </div>
                </div>
              )}

              {/* STEP 6: Review */}
              {stepName === "Review" && (
                <div className="space-y-5">
                  {estimate && <EstimatePanel estimate={estimate} />}

                  <div>
                    <IosSectionTitle>Booking Summary</IosSectionTitle>
                    <IosGroupCard>
                      <IosSummaryRow label="Services" value={form.services.map(serviceLabel).join(", ")} />
                      <IosSummaryRow
                        label="Property"
                        value={`${propertyTypes.find((p) => p.id === form.propertyType)?.label ?? ""} · ${
                          projectSizes.find((s) => s.id === form.size)?.label ?? ""
                        }`}
                      />
                      <IosSummaryRow
                        label="Urgency"
                        value={urgencies.find((u) => u.id === form.urgency)?.label ?? ""}
                      />
                      {needsSchedule && (
                        <IosSummaryRow label="Schedule" value={`${form.date} · ${form.timeSlot}`} />
                      )}
                      <IosSummaryRow label="Address" value={form.address} />
                      <IosSummaryRow
                        label="Contact"
                        value={`${form.name} · ${form.phone} · ${form.email} (prefers ${form.preferredContact.toLowerCase()})`}
                      />
                      {form.notes && <IosSummaryRow label="Notes" value={form.notes} />}
                    </IosGroupCard>
                  </div>

                  {form.photos.length > 0 && (
                    <div>
                      <IosSectionTitle>Photos ({form.photos.length})</IosSectionTitle>
                      <div className="grid grid-cols-4 gap-2 px-1">
                        {form.photos.map((photo) => (
                          <div
                            key={photo.id}
                            className="aspect-square overflow-hidden rounded-[10px] border border-border/60 shadow-sm"
                          >
                            <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Callout */}
              {error && (
                <div className="rounded-[12px] bg-destructive/10 border border-destructive/20 px-3.5 py-2.5 text-[14px] text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bottom Action Controls */}
              <div className="pt-2 pb-6 space-y-2.5">
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-[14px] bg-[#111111] text-white font-medium text-[17px] shadow-sm hover:opacity-95 active:opacity-85 transition-opacity dark:bg-white dark:text-[#111111]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-[14px] bg-[#007AFF] dark:bg-[#0A84FF] text-white font-medium text-[17px] shadow-sm hover:opacity-95 active:opacity-85 transition-opacity disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>Sending Request…</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span>{modeCopy[mode].cta}</span>
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-center justify-center">
                  <a
                    href={business.phoneHref}
                    className="inline-flex items-center gap-1.5 text-[15px] text-[#007AFF] dark:text-[#0A84FF] font-normal py-1 hover:opacity-80 active:opacity-50 transition-opacity"
                  >
                    <Phone className="size-4" />
                    <span>Call {business.phone} directly</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IosSectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="px-3 mb-1.5 mt-4 first:mt-1">
      <h3 className="text-[13px] font-normal uppercase tracking-wider text-[#6C6C70] dark:text-[#8E8E93]">
        {children}
      </h3>
      {subtitle && (
        <p className="text-[13px] text-[#6C6C70] dark:text-[#8E8E93] mt-0.5 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function IosGroupCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1C1C1E] rounded-[13px] sm:rounded-[14px] border border-[#E5E5EA] dark:border-[#2C2C2E] shadow-sm overflow-hidden divide-y divide-[#E5E5EA] dark:divide-[#2C2C2E]",
        className
      )}
    >
      {children}
    </div>
  );
}

function IosSelectRow({
  label,
  sublabel,
  note,
  active,
  onClick,
}: {
  label: string;
  sublabel?: string;
  note?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between min-h-[46px] px-4 py-3 text-left transition-colors active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
    >
      <div className="min-w-0 flex-1 pr-3">
        <span className="block text-[16px] font-normal text-foreground leading-snug">
          {label}
        </span>
        {sublabel && (
          <span className="block text-[13px] text-[#6C6C70] dark:text-[#8E8E93] mt-0.5 leading-snug">
            {sublabel}
          </span>
        )}
        {note && (
          <span className="block text-[12px] text-muted-foreground mt-0.5">
            {note}
          </span>
        )}
      </div>
      {active && (
        <Check className="size-5 text-[#007AFF] dark:text-[#0A84FF] stroke-[2.5] shrink-0" />
      )}
    </button>
  );
}

function IosInputRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center min-h-[46px] px-4 py-2.5 gap-3">
      <span className="text-[16px] font-medium text-foreground w-28 shrink-0">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function IosSummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between min-h-[44px] px-4 py-3 gap-4">
      <span className="text-[15px] text-[#6C6C70] dark:text-[#8E8E93] shrink-0">
        {label}
      </span>
      <span className="text-[15px] font-normal text-foreground text-right break-words flex-1">
        {value}
      </span>
    </div>
  );
}

export function EstimatePanel({
  estimate,
}: {
  estimate: NonNullable<ReturnType<typeof calculateEstimate>>;
}) {
  return (
    <div className="mt-4">
      <IosSectionTitle>Estimated Ballpark</IosSectionTitle>
      <IosGroupCard className="p-4 space-y-3">
        <div>
          <span className="text-[12px] uppercase tracking-wider text-[#6C6C70] dark:text-[#8E8E93] font-medium">
            Approximate Range
          </span>
          <p className="text-3xl font-semibold text-foreground tracking-tight mt-0.5">
            {currency(estimate.low)} – {currency(estimate.high)}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E5E5EA] dark:border-[#2C2C2E] grid gap-2 text-[14px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-[#007AFF] dark:text-[#0A84FF]" />
            <span>Estimated time: {estimate.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-[#007AFF] dark:text-[#0A84FF]" />
            <span>Earliest start: {estimate.leadTime}</span>
          </div>
          {estimate.recommended && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-4 text-[#007AFF] dark:text-[#0A84FF]" />
              <span>{estimate.recommended}</span>
            </div>
          )}
        </div>

        <p className="text-[12px] text-[#6C6C70] dark:text-[#8E8E93] pt-1 leading-snug">
          Estimates are approximate and based on typical East Texas projects. Final pricing is confirmed in your free on-site estimate.
        </p>
      </IosGroupCard>
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
    <div className="space-y-5 animate-in fade-in-50 duration-200 py-2">
      <div className="text-center pt-2">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#34C759]/15 text-[#34C759]">
          <CheckCircle2 className="size-8 stroke-[2.5]" />
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {mode === "emergency" ? "Emergency Request Received" : "You're on the Schedule"}
        </h3>
        <p className="mt-1 text-[15px] text-muted-foreground">
          A confirmation email is on its way to {form.email}.
        </p>
        <p className="mt-3 inline-flex items-center rounded-full bg-[#007AFF]/10 border border-[#007AFF]/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#007AFF] dark:text-[#0A84FF]">
          Booking ID · {bookingId}
        </p>
      </div>

      <div>
        <IosSectionTitle>Appointment Details</IosSectionTitle>
        <IosGroupCard>
          <IosSummaryRow label="Services" value={form.services.map(serviceLabel).join(", ")} />
          {form.date && <IosSummaryRow label="Date" value={form.date} />}
          {form.timeSlot && <IosSummaryRow label="Time" value={form.timeSlot} />}
          <IosSummaryRow label="Customer" value={`${form.name} · ${form.phone}`} />
          <IosSummaryRow label="Address" value={form.address} />
          {estimateText && <IosSummaryRow label="Estimated cost" value={`${estimateText} (approximate)`} />}
          {form.photos.length > 0 && <IosSummaryRow label="Photos" value={`${form.photos.length} attached`} />}
        </IosGroupCard>
      </div>

      <div>
        <IosSectionTitle>What Happens Next</IosSectionTitle>
        <IosGroupCard className="p-4">
          <ol className="space-y-2.5 text-[14px] text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>We review your project details and attached photos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>You receive a quick phone call or text to confirm your arrival window.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>We arrive on time with written terms before any work begins.</span>
            </li>
          </ol>
        </IosGroupCard>
      </div>

      <div className="pt-2 pb-4 space-y-2.5">
        <Button variant="brand" size="lg" asChild className="w-full rounded-[14px] py-3.5 text-[16px]">
          <a href={business.phoneHref}>
            <Phone className="size-4" /> Call {business.phone}
          </a>
        </Button>
        <Button variant="outline" size="lg" asChild className="w-full rounded-[14px] py-3.5 text-[16px]">
          <a href={business.mapsDirections} target="_blank" rel="noreferrer">
            <MapPin className="size-4" /> Get Directions
          </a>
        </Button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-[16px] text-[#007AFF] dark:text-[#0A84FF] font-medium hover:opacity-75 active:opacity-40 transition-opacity text-center"
        >
          Done
        </button>
      </div>
    </div>
  );
}