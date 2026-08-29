import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/services")({
  ssr: false,
  component: ServicesAdmin,
});

function ServicesAdmin() {
  return (
    <AdminPage title="Services" description="Manage services, categories, pricing guides, ordering and visibility.">
      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-4">
          <ResourceManager
            config={{
              table: "services",
              singular: "service",
              plural: "services",
              searchColumns: ["name", "slug", "summary"],
              defaultSort: { column: "sort_order", ascending: true },
              filters: [
                {
                  name: "is_visible",
                  label: "Visibility",
                  options: [
                    { label: "Visible", value: "true" },
                    { label: "Hidden", value: "false" },
                  ],
                },
              ],
              fields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "slug", label: "Slug", type: "text", required: true },
                { name: "summary", label: "Summary", type: "textarea" },
                { name: "description", label: "Description", type: "richtext" },
                { name: "price_from", label: "Price from", type: "money" },
                { name: "price_to", label: "Price to", type: "money" },
                { name: "price_unit", label: "Price unit", type: "text", defaultValue: "job" },
                { name: "pricing_guide", label: "Pricing guide (JSON)", type: "json", inTable: false },
                { name: "image_url", label: "Image", type: "media" },
                { name: "icon", label: "Icon", type: "text", inTable: false },
                { name: "is_featured", label: "Featured", type: "boolean" },
                { name: "is_visible", label: "Visible", type: "boolean", defaultValue: true },
                { name: "sort_order", label: "Order", type: "number" },
                { name: "seo_title", label: "SEO title", type: "text", inTable: false },
                { name: "seo_description", label: "SEO description", type: "textarea", inTable: false },
              ],
            }}
          />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <ResourceManager
            config={{
              table: "service_categories",
              singular: "category",
              plural: "categories",
              searchColumns: ["name", "slug"],
              defaultSort: { column: "sort_order", ascending: true },
              fields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "slug", label: "Slug", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "icon", label: "Icon", type: "text" },
                { name: "sort_order", label: "Order", type: "number" },
                { name: "is_visible", label: "Visible", type: "boolean", defaultValue: true },
              ],
            }}
          />
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
