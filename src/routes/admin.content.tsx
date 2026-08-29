import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/content")({
  ssr: false,
  component: ContentAdmin,
});

const SECTIONS = [
  { label: "Homepage", value: "home" },
  { label: "Hero", value: "hero" },
  { label: "About", value: "about" },
  { label: "Services", value: "services" },
  { label: "Why choose us", value: "why" },
  { label: "Testimonials", value: "testimonials" },
  { label: "FAQ", value: "faq" },
  { label: "Contact", value: "contact" },
  { label: "Footer", value: "footer" },
  { label: "Navigation", value: "nav" },
  { label: "SEO", value: "seo" },
];

function ContentAdmin() {
  return (
    <AdminPage
      title="Website content"
      description="Edit every section of the public website with rich text and media."
    >
      <ResourceManager
        config={{
          table: "content_blocks",
          singular: "content block",
          plural: "content blocks",
          searchColumns: ["key", "label", "section"],
          defaultSort: { column: "sort_order", ascending: true },
          filters: [{ name: "section", label: "Section", options: SECTIONS }],
          fields: [
            { name: "label", label: "Label", type: "text", required: true },
            { name: "key", label: "Key", type: "text", required: true, help: "Unique identifier used by the website" },
            { name: "section", label: "Section", type: "select", defaultValue: "home", options: SECTIONS },
            {
              name: "kind",
              label: "Kind",
              type: "select",
              defaultValue: "richtext",
              options: [
                { label: "Rich text", value: "richtext" },
                { label: "Plain text", value: "text" },
                { label: "List", value: "list" },
                { label: "Media", value: "media" },
                { label: "Structured (JSON)", value: "json" },
              ],
            },
            { name: "data", label: "Content (JSON)", type: "json", inTable: false },
            { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
            { name: "sort_order", label: "Order", type: "number", inTable: false },
          ],
        }}
      />
    </AdminPage>
  );
}
