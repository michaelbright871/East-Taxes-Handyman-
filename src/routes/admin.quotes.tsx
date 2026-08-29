import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

const STATUS = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];

export const Route = createFileRoute("/admin/quotes")({
  ssr: false,
  component: QuotesAdmin,
});

function QuotesAdmin() {
  return (
    <AdminPage
      title="Quotes & estimates"
      description="Build estimates, approve them, and convert them into scheduled bookings."
    >
      <ResourceManager
        config={{
          table: "quotes",
          singular: "quote",
          plural: "quotes",
          searchColumns: ["reference", "customer_name", "customer_email", "service_name"],
          filters: [{ name: "status", label: "Status", options: STATUS }],
          fields: [
            { name: "reference", label: "Reference", type: "text" },
            { name: "customer_name", label: "Customer", type: "text", required: true },
            { name: "customer_email", label: "Email", type: "text", inTable: false },
            { name: "customer_phone", label: "Phone", type: "text", inTable: false },
            { name: "service_name", label: "Service", type: "text" },
            { name: "service_slug", label: "Service slug", type: "text", inTable: false },
            { name: "details", label: "Scope", type: "textarea", inTable: false },
            { name: "line_items", label: "Line items (JSON)", type: "json", inTable: false },
            { name: "subtotal", label: "Subtotal", type: "money", inTable: false },
            { name: "tax", label: "Tax", type: "money", inTable: false },
            { name: "total", label: "Total", type: "money" },
            { name: "status", label: "Status", type: "status", defaultValue: "draft", options: STATUS },
            { name: "valid_until", label: "Valid until", type: "date" },
            { name: "admin_notes", label: "Internal notes", type: "textarea", inTable: false },
          ],
        }}
      />
    </AdminPage>
  );
}
