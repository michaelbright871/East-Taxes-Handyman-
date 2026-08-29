export interface BookingEmailPayload {
  bookingId: string;
  requestType: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  propertyType: string;
  urgency: string;
  date?: string | undefined;
  timeSlot?: string | undefined;
  notes?: string | undefined;
  photoCount: number;
  estimateLow?: number | undefined;
  estimateHigh?: number | undefined;
  duration?: string | undefined;
  preferredContact?: string | undefined;
}

/** Plain-text confirmation summary — ready to drop into a transactional email template. */
export function buildConfirmationSummary(payload: BookingEmailPayload) {
  const lines = [
    `Booking ID: ${payload.bookingId}`,
    `Request type: ${payload.requestType}`,
    `Customer: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Address: ${payload.address}`,
    `Property type: ${payload.propertyType}`,
    `Services: ${payload.services.join(", ")}`,
    `Urgency: ${payload.urgency}`,
  ];
  if (payload.date) lines.push(`Preferred date: ${payload.date}`);
  if (payload.timeSlot) lines.push(`Preferred time: ${payload.timeSlot}`);
  if (payload.estimateLow && payload.estimateHigh)
    lines.push(`Estimated range: $${payload.estimateLow} – $${payload.estimateHigh} (approximate)`);
  if (payload.duration) lines.push(`Estimated duration: ${payload.duration}`);
  if (payload.preferredContact) lines.push(`Preferred contact: ${payload.preferredContact}`);
  lines.push(`Photos attached: ${payload.photoCount}`);
  if (payload.notes) lines.push(`Notes: ${payload.notes}`);
  return lines.join("\n");
}
