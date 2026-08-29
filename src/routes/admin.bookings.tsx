import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

const STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

export const Route = createFileRoute("/admin/bookings")({
  ssr: false,
  component: BookingsAdmin,
});

function BookingsAdmin() {
  return (
    <AdminPage title="Bookings" description="Approve, schedule, assign and track every job request.">
      <ResourceManager
        config={{
          table: "bookings",
          singular: "booking",
          plural: "bookings",
          searchColumns: ["reference", "customer_name", "customer_email", "service_name", "city"],
          filters: [
            { name: "status", label: "Status", options: STATUS },
            {
              name: "priority",
              label: "Priority",
              options: [
                { label: "Low", value: "low" },
                { label: "Normal", value: "normal" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ],
            },
          ],
          fields: [
            { name: "reference", label: "Reference", type: "text" },
            { name: "customer_name", label: "Customer", type: "text", required: true },
            { name: "customer_email", label: "Email", type: "text", inTable: false },
            { name: "customer_phone", label: "Phone", type: "text", inTable: false },
            { name: "address", label: "Address", type: "text", inTable: false },
            { name: "city", label: "City", type: "text", inTable: false },
            { name: "service_name", label: "Service", type: "text" },
            { name: "service_slug", label: "Service slug", type: "text", inTable: false },
            { name: "details", label: "Job details", type: "textarea", inTable: false },
            { name: "preferred_date", label: "Preferred date", type: "date", inTable: false },
            { name: "preferred_window", label: "Preferred window", type: "text", inTable: false },
            { name: "scheduled_at", label: "Scheduled", type: "datetime" },
            { name: "status", label: "Status", type: "status", defaultValue: "pending", options: STATUS },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              defaultValue: "normal",
              inTable: false,
              options: [
                { label: "Low", value: "low" },
                { label: "Normal", value: "normal" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ],
            },
            { name: "assigned_technician", label: "Technician", type: "text" },
            { name: "estimate_low", label: "Estimate low", type: "money", inTable: false },
            { name: "estimate_high", label: "Estimate high", type: "money", inTable: false },
            { name: "admin_notes", label: "Internal notes", type: "textarea", inTable: false },
          ],
        }}
      />
    </AdminPage>
  );
}
