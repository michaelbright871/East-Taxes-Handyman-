import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/settings")({ ssr: false, component: SettingsAdmin });

function SettingsAdmin() {
  return (
    <AdminPage title="Website settings" description="Business details, contact info, social links and branding.">
      <ResourceManager
        config={{
          table: "site_settings",
          singular: "setting",
          plural: "settings",
          searchColumns: ["key"],
          fields: [
            { name: "key", label: "Key", type: "text", required: true },
            { name: "value", label: "Value", type: "json", required: true },
          ],
        }}
      />
    </AdminPage>
  );
}
