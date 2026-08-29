import { createServerFn } from "@tanstack/react-start";
import { buildConfirmationSummary, type BookingEmailPayload } from "./booking-email";

/**
 * Records a booking request server-side and prepares the confirmation email content.
 * Email delivery can be wired in here without touching the booking UI.
 */
export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingEmailPayload) => data)
  .handler(async ({ data }) => {
    const summary = buildConfirmationSummary(data);
    console.info("[booking] new request\n" + summary);
    return { ok: true, bookingId: data.bookingId, summary };
  });
