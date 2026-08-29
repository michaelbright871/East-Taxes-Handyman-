import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/ui-bits";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/marketing")({
  ssr: false,
  component: MarketingAdmin,
});

function MarketingAdmin() {
  return (
    <AdminPage
      title="Marketing"
      description="Promotional banners, coupons, popups, newsletter subscribers and referrals."
    >
      <Tabs defaultValue="banners">
        <TabsList className="flex-wrap">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="popups">Popups</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-4">
          <ResourceManager
            config={{
              table: "promo_banners",
              singular: "banner",
              plural: "banners",
              searchColumns: ["title", "message"],
              fields: [
                { name: "title", label: "Title", type: "text", required: true },
                { name: "message", label: "Message", type: "textarea", required: true },
                { name: "cta_label", label: "Button label", type: "text" },
                { name: "cta_href", label: "Button link", type: "text" },
                {
                  name: "theme",
                  label: "Theme",
                  type: "select",
                  defaultValue: "primary",
                  options: [
                    { label: "Primary", value: "primary" },
                    { label: "Accent", value: "accent" },
                    { label: "Warning", value: "warning" },
                  ],
                },
                {
                  name: "placement",
                  label: "Placement",
                  type: "select",
                  defaultValue: "top",
                  options: [
                    { label: "Top", value: "top" },
                    { label: "Bottom", value: "bottom" },
                  ],
                },
                { name: "starts_at", label: "Starts", type: "datetime", inTable: false },
                { name: "ends_at", label: "Ends", type: "datetime", inTable: false },
                { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="coupons" className="mt-4">
          <ResourceManager
            config={{
              table: "coupons",
              singular: "coupon",
              plural: "coupons",
              searchColumns: ["code", "description"],
              fields: [
                { name: "code", label: "Code", type: "text", required: true },
                { name: "description", label: "Description", type: "text" },
                {
                  name: "discount_type",
                  label: "Type",
                  type: "select",
                  defaultValue: "percent",
                  options: [
                    { label: "Percent", value: "percent" },
                    { label: "Fixed amount", value: "fixed" },
                  ],
                },
                { name: "discount_value", label: "Value", type: "number", required: true },
                { name: "max_redemptions", label: "Max uses", type: "number", inTable: false },
                { name: "redemptions", label: "Used", type: "number", inTable: false },
                { name: "starts_at", label: "Starts", type: "datetime", inTable: false },
                { name: "ends_at", label: "Ends", type: "datetime", inTable: false },
                { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="popups" className="mt-4">
          <ResourceManager
            config={{
              table: "popup_campaigns",
              singular: "campaign",
              plural: "campaigns",
              searchColumns: ["name", "headline"],
              fields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "headline", label: "Headline", type: "text", required: true },
                { name: "body", label: "Body", type: "textarea" },
                { name: "image_url", label: "Image", type: "media", inTable: false },
                { name: "cta_label", label: "Button label", type: "text", inTable: false },
                { name: "cta_href", label: "Button link", type: "text", inTable: false },
                {
                  name: "trigger_type",
                  label: "Trigger",
                  type: "select",
                  defaultValue: "delay",
                  options: [
                    { label: "Time delay (s)", value: "delay" },
                    { label: "Scroll depth (%)", value: "scroll" },
                    { label: "Exit intent", value: "exit" },
                  ],
                },
                { name: "trigger_value", label: "Trigger value", type: "number", defaultValue: 10 },
                { name: "starts_at", label: "Starts", type: "datetime", inTable: false },
                { name: "ends_at", label: "Ends", type: "datetime", inTable: false },
                { name: "is_active", label: "Active", type: "boolean" },
                { name: "impressions", label: "Views", type: "number", inTable: false },
                { name: "conversions", label: "Conversions", type: "number", inTable: false },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="newsletter" className="mt-4">
          <ResourceManager
            config={{
              table: "newsletter_subscribers",
              singular: "subscriber",
              plural: "subscribers",
              searchColumns: ["email", "name"],
              fields: [
                { name: "email", label: "Email", type: "text", required: true },
                { name: "name", label: "Name", type: "text" },
                { name: "source", label: "Source", type: "text", defaultValue: "website" },
                { name: "is_subscribed", label: "Subscribed", type: "boolean", defaultValue: true },
              ],
            }}
          />
        </TabsContent>

        <TabsContent value="referrals" className="mt-4">
          <ResourceManager
            config={{
              table: "referrals",
              singular: "referral",
              plural: "referrals",
              searchColumns: ["referrer_name", "referrer_email", "code"],
              fields: [
                { name: "referrer_name", label: "Referrer", type: "text", required: true },
                { name: "referrer_email", label: "Referrer email", type: "text" },
                { name: "referred_name", label: "Referred", type: "text" },
                { name: "referred_email", label: "Referred email", type: "text", inTable: false },
                { name: "code", label: "Code", type: "text", required: true },
                { name: "reward", label: "Reward", type: "text", inTable: false },
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
              ],
            }}
          />
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
