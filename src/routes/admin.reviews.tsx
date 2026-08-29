import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/reviews")({
  ssr: false,
  component: ReviewsAdmin,
});

function ReviewsAdmin() {
  return (
    <AdminPage title="Reviews" description="Approve, pin, edit or hide customer testimonials.">
      <ResourceManager
        config={{
          table: "reviews",
          singular: "review",
          plural: "reviews",
          searchColumns: ["author_name", "title", "body", "service_name"],
          filters: [
            {
              name: "status",
              label: "Status",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ],
            },
          ],
          fields: [
            { name: "author_name", label: "Author", type: "text", required: true },
            { name: "author_location", label: "Location", type: "text" },
            { name: "rating", label: "Rating", type: "number", defaultValue: 5 },
            { name: "title", label: "Title", type: "text" },
            { name: "body", label: "Review", type: "textarea", required: true },
            { name: "service_name", label: "Service", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "status",
              defaultValue: "pending",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ],
            },
            { name: "is_pinned", label: "Pinned", type: "boolean" },
            { name: "is_hidden", label: "Hidden", type: "boolean" },
            { name: "avatar_url", label: "Avatar", type: "media", inTable: false },
            { name: "source", label: "Source", type: "text", defaultValue: "website", inTable: false },
            { name: "sort_order", label: "Order", type: "number", inTable: false },
          ],
        }}
      />
    </AdminPage>
  );
}
