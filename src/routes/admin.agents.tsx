import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/agents")({
  ssr: false,
  component: AgentsAdmin,
});

function AgentsAdmin() {
  return (
    <AdminPage
      title="Agents"
      description="Manage support agents, availability, workload limits and permissions."
    >
      <ResourceManager
        config={{
          table: "agent_presence",
          singular: "agent",
          plural: "agents",
          searchColumns: ["display_name"],
          defaultSort: { column: "updated_at", ascending: false },
          fields: [
            { name: "display_name", label: "Name", type: "text", required: true },
            { name: "agent_id", label: "User ID", type: "text", required: true, help: "The auth user id for this agent" },
            { name: "is_online", label: "Online", type: "boolean" },
            { name: "max_chats", label: "Max chats", type: "number", defaultValue: 5 },
            { name: "total_chats", label: "Total chats", type: "number" },
            { name: "avg_response_seconds", label: "Avg response (s)", type: "number" },
            {
              name: "permissions",
              label: "Permissions",
              type: "tags",
              inTable: false,
              placeholder: "chats, bookings, quotes",
            },
          ],
        }}
      />
    </AdminPage>
  );
}
