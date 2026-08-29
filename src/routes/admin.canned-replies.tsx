import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/canned-replies")({
  ssr: false,
  component: CannedAdmin,
});

function CannedAdmin() {
  return (
    <AdminPage title="Canned replies" description="Saved responses your agents can insert during live chats.">
      <ResourceManager
        config={{
          table: "canned_replies",
          singular: "reply",
          plural: "replies",
          searchColumns: ["title", "body", "shortcut", "category"],
          fields: [
            { name: "title", label: "Title", type: "text", required: true },
            { name: "shortcut", label: "Shortcut", type: "text", placeholder: "/hours" },
            { name: "category", label: "Category", type: "text", defaultValue: "general" },
            { name: "body", label: "Message", type: "textarea", required: true },
            { name: "usage_count", label: "Used", type: "number", inTable: true },
          ],
        }}
      />
    </AdminPage>
  );
}
