import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/customers")({
  ssr: false,
  component: CustomersAdmin,
});

function CustomersAdmin() {
  const { user: currentUser } = useAuth();
  
  return (
    <AdminPage
      title="Users & Customers"
      description="Manage user accounts, view customer details, and assign roles."
    >
      <ResourceManager
        config={{
          table: "profiles",
          singular: "user",
          plural: "users",
          searchColumns: ["email", "full_name"],
          defaultSort: { column: "created_at", ascending: false },
          fields: [
            { name: "email", label: "Email", type: "text", required: true, readOnly: true, inTable: true },
            { name: "full_name", label: "Full Name", type: "text", inTable: true },
            { name: "phone", label: "Phone", type: "text", inTable: true },
            { name: "status", label: "Status", type: "status", inTable: true, options: [
              { label: "Active", value: "active" },
              { label: "Disabled", value: "disabled" },
            ]},
            { name: "created_at", label: "Joined", type: "date", readOnly: true, inTable: true },
          ],
        }}
      />
      
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Role Management</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          View and modify system roles. Admins can promote other users.
        </p>
        <ResourceManager
          config={{
            table: "user_roles",
            singular: "role",
            plural: "roles",
            canCreate: true,
            canDelete: true,
            fields: [
              { name: "user_id", label: "User ID (UUID)", type: "text", required: true },
              { name: "role", label: "Role", type: "select", required: true, options: [
                { label: "Admin", value: "admin" },
                { label: "Agent", value: "agent" },
                { label: "Customer", value: "customer" },
              ]},
            ],
          }}
        />
      </div>
    </AdminPage>
  );
}
