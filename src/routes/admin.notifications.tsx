import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/notifications")({ ssr: false, component: NotificationsAdmin });

function NotificationsAdmin() {
  return (
    <AdminPage title="Notifications" description="New customers, quotes, bookings, chats, reviews and system alerts.">
      <ResourceManager
        config={{
          table: "admin_notifications",
          singular: "notification",
          plural: "notifications",
          searchColumns: ["title", "body", "type"],
          filters: [
            {
              name: "severity",
              label: "Severity",
              options: [
                { label: "Info", value: "info" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Error", value: "error" },
              ],
            },
          ],
          fields: [
            { name: "title", label: "Title", type: "text", required: true },
            { name: "body", label: "Body", type: "textarea" },
            { name: "type", label: "Type", type: "text", defaultValue: "system" },
            {
              name: "severity",
              label: "Severity",
              type: "status",
              defaultValue: "info",
              options: [
                { label: "Info", value: "info" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Error", value: "error" },
              ],
            },
            { name: "href", label: "Link", type: "text", inTable: false },
            { name: "is_read", label: "Read", type: "boolean" },
          ],
        }}
      />
    </AdminPage>
  );
}
