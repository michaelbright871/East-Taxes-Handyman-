import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About, CraftsmanshipBand, Work } from "@/components/site/Sections";
import { Estimate, ServiceArea } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BookingProvider } from "@/components/site/booking/BookingProvider";
import { CostCalculator } from "@/components/site/CostCalculator";
import { EmergencyBanner } from "@/components/site/EmergencyBanner";
import { GoogleReviews } from "@/components/site/trust/GoogleReviews";
import {
  WhyChooseUs,
  HowItWorks,
  FeaturedServicesShowcase,
} from "@/components/site/content/ContentSections";
import { supabase } from "@/integrations/supabase/client";

const TrustBadges = lazy(async () => {
  const module = await import("@/components/site/trust/TrustSignals");
  return { default: module.TrustBadges };
});
const CustomerStories = lazy(async () => {
  const module = await import("@/components/site/trust/CustomerStories");
  return { default: module.CustomerStories };
});
const GuaranteeWarranty = lazy(async () => {
  const module = await import("@/components/site/trust/TrustSignals");
  return { default: module.GuaranteeWarranty };
});

interface LoaderData {
  settings: Record<string, any>;
  media: Record<string, string>;
}

export const Route = createFileRoute("/")({
  component: Index,
  head: ({ loaderData }) => {
    const data = loaderData as unknown as LoaderData;
    const settings = data?.settings || {};
    const media = data?.media || {};
    const title = settings?.["seo_defaults"]?.["title"] || "East Texas Handyman Services | Longview, TX Home Repair";
    const description = settings?.["seo_defaults"]?.["description"] || "Trusted handyman in Longview, TX. Carpentry, drywall, painting, doors, flooring, fence & deck repair.";
    const heroVideo = media?.["hero-video"] || "/videos/hero.mp4";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: "/" },
        { rel: "preload", as: "video", href: heroVideo, type: "video/mp4" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: settings?.["business_info"]?.["name"] || "East Texas Handyman Services",
            description: description,
            telephone: settings?.["business_info"]?.["phone"] || "+1 (469) 678-6244",
            address: {
              "@type": "PostalAddress",
              streetAddress: settings?.["business_info"]?.["address"]?.split(",")[0] || "2505 Clinton St",
              addressLocality: "Longview",
              addressRegion: "TX",
              postalCode: "75604",
              addressCountry: "US",
            },
            areaServed: [
              "Longview, TX",
              "Kilgore, TX",
              "Gladewater, TX",
              "White Oak, TX",
              "Hallsville, TX",
              "Marshall, TX",
              "Tyler, TX",
            ],
            openingHours: "Mo-Sa 07:00-18:00",
            AggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 4.9,
              reviewCount: 187,
              bestRating: 5,
            },
            priceRange: "$$",
          }),
        },
      ],
    };
  },
  loader: async ({ context }) => {
    const [settings, media] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["site-settings"],
        queryFn: async () => {
          const { data: remote } = await (supabase.from("site_settings" as any) as any).select("*");
          return (remote || []).reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
        }
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["media-assets"],
        queryFn: async () => {
          const { data: remote } = await (supabase.from("media_assets" as any) as any).select("*");
          return (remote || []).reduce((acc: any, item: any) => {
            acc[item.name] = item.url;
            return acc;
          }, {});
        }
      })
    ]);
    return { settings, media } as LoaderData;
  }
});

function Index() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main>
          <Hero />
          <EmergencyBanner />
          <Services />
          <FeaturedServicesShowcase />
          <WhyChooseUs />
          <HowItWorks />
          <CostCalculator />
          <About />
          <CraftsmanshipBand />
          <Work />
          <Suspense fallback={<div className="py-12" /> }>
            <TrustBadges />
          </Suspense>
          <GoogleReviews />
          <Suspense fallback={<div className="py-12" /> }>
            <CustomerStories />
            <GuaranteeWarranty />
          </Suspense>
          <ServiceArea />
          <Estimate />
        </main>
        <SiteFooter />
      </div>
    </BookingProvider>
  );
}