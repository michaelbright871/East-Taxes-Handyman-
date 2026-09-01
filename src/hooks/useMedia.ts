import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveMediaUrl } from "@/content/media";

const FALLBACK_MEDIA: Record<string, string> = {
  "hero-video": "/videos/hero.mp4",
  "services-video": "/videos/services.mp4",
  "craftsmanship-video": "/videos/craftsmanship.mp4",
  "carpentry-video": "/videos/carpentry.mp4",
  "painting-video": "/videos/painting.mp4",
  "exterior-video": "/videos/exterior.mp4",
  "testimonials-video": "/videos/testimonials.mp4",
  "contact-video": "/videos/contact.mp4",
};

export function useMedia() {
  return useQuery({
    queryKey: ["media-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*");

      if (error) throw error;

      return (data || []).reduce<Record<string, string>>((acc, item) => {
        const name = typeof item.name === "string" ? item.name : "";
        const url = typeof item.url === "string" ? item.url : "";
        if (!name) return acc;

        acc[name] = resolveMediaUrl(url, FALLBACK_MEDIA[name] ?? "/videos/hero.mp4");
        return acc;
      }, { ...FALLBACK_MEDIA });
    },
    staleTime: 5 * 60 * 1000,
  });
}
