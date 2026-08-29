import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/gallery")({
  ssr: false,
  component: GalleryAdmin,
});

const CATEGORIES = [
  { label: "Carpentry", value: "carpentry" },
  { label: "Painting", value: "painting" },
  { label: "Drywall", value: "drywall" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "Flooring", value: "flooring" },
  { label: "Fence & deck", value: "fence-deck" },
  { label: "Pressure washing", value: "pressure-washing" },
];

function GalleryAdmin() {
  return (
    <AdminPage
      title="Gallery"
      description="Featured projects, project media and the before & after showcase."
    >
      <Tabs defaultValue="projects">
        <TabsList className="flex-wrap">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="beforeafter">Before &amp; after</TabsTrigger>
          <TabsTrigger value="media">Project media</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <ResourceManager
            config={{
              table: "projects",
              singular: "project",
              plural: "projects",
              searchColumns: ["title", "slug", "location", "description"],
              defaultSort: { column: "sort_order", ascending: true },
              filters: [
                { name: "category", label: "Category", options: CATEGORIES },
                {
                  name: "property_type",
                  label: "Property",
                  options: [
                    { label: "Residential", value: "residential" },
                    { label: "Commercial", value: "commercial" },
                  ],
                },
              ],
              fields: [
                { name: "title", label: "Title", type: "text", required: true },
                { name: "slug", label: "Slug", type: "text", required: true },
                { name: "category", label: "Category", type: "select", options: CATEGORIES, defaultValue: "carpentry" },
                {
                  name: "property_type",
                  label: "Property type",
                  type: "select",
                  defaultValue: "residential",
                  options: [
                    { label: "Residential", value: "residential" },
                    { label: "Commercial", value: "commercial" },
                  ],
                },
                { name: "location", label: "Location", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "cover_url", label: "Cover image", type: "media" },
                { name: "related_services", label: "Related services", type: "tags", inTable: false },
                { name: "completed_on", label: "Completed", type: "date", inTable: false },
                { name: "is_featured", label: "Featured", type: "boolean" },
                { name: "is_visible", label: "Visible", type: "boolean", defaultValue: true },
                { name: "popularity", label: "Popularity", type: "number", inTable: false },
                { name: "sort_order", label: "Order", type: "number", inTable: false },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="beforeafter" className="mt-4">
          <ResourceManager
            config={{
              table: "before_after",
              singular: "comparison",
              plural: "comparisons",
              searchColumns: ["title", "service_name", "location", "description"],
              defaultSort: { column: "sort_order", ascending: true },
              filters: [{ name: "category", label: "Category", options: CATEGORIES }],
              fields: [
                { name: "title", label: "Title", type: "text", required: true },
                { name: "service_name", label: "Service", type: "text" },
                { name: "category", label: "Category", type: "select", options: CATEGORIES, defaultValue: "carpentry" },
                { name: "location", label: "Location", type: "text", inTable: false },
                { name: "description", label: "Description", type: "textarea", inTable: false },
                { name: "before_url", label: "Before image", type: "media", required: true },
                { name: "after_url", label: "After image", type: "media", required: true },
                { name: "is_visible", label: "Visible", type: "boolean", defaultValue: true },
                { name: "sort_order", label: "Order", type: "number", inTable: false },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <ResourceManager
            config={{
              table: "project_media",
              singular: "media item",
              plural: "media items",
              searchColumns: ["caption", "url"],
              defaultSort: { column: "sort_order", ascending: true },
              fields: [
                {
                  name: "kind",
                  label: "Kind",
                  type: "select",
                  defaultValue: "image",
                  options: [
                    { label: "Image", value: "image" },
                    { label: "Video", value: "video" },
                  ],
                },
                { name: "url", label: "File", type: "media", required: true },
                { name: "poster_url", label: "Poster", type: "media", inTable: false },
                { name: "caption", label: "Caption", type: "text" },
                { name: "project_id", label: "Project ID", type: "text", inTable: false },
                { name: "sort_order", label: "Order", type: "number", inTable: false },
              ],
            }}
          />
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
