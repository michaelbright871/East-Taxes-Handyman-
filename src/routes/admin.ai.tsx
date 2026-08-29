import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/ai")({
  ssr: false,
  component: AiAdmin,
});

const CATEGORIES = [
  { label: "Business info", value: "business" },
  { label: "Services", value: "services" },
  { label: "Pricing", value: "pricing" },
  { label: "Service areas", value: "areas" },
  { label: "FAQ", value: "faq" },
  { label: "DIY guide", value: "diy" },
  { label: "Troubleshooting", value: "troubleshooting" },
];

function AiAdmin() {
  return (
    <AdminPage
      title="AI knowledge"
      description="Everything here is used by Ranger, the AI assistant, when answering customers."
    >
      <ResourceManager
        config={{
          table: "ai_knowledge",
          singular: "knowledge entry",
          plural: "knowledge entries",
          searchColumns: ["topic", "content", "category"],
          defaultSort: { column: "sort_order", ascending: true },
          filters: [{ name: "category", label: "Category", options: CATEGORIES }],
          fields: [
            { name: "topic", label: "Topic", type: "text", required: true },
            { name: "category", label: "Category", type: "select", defaultValue: "business", options: CATEGORIES },
            { name: "content", label: "Content", type: "textarea", required: true },
            { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
            { name: "sort_order", label: "Order", type: "number" },
          ],
        }}
      />
    </AdminPage>
  );
}
