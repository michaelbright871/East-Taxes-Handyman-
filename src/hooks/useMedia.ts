import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMedia() {
  return useQuery({
    queryKey: ["media-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*");

      if (error) throw error;

      // Map by name for easy lookup if they are used as named "global" assets
      return (data || []).reduce((acc: Record<string, any>, item) => {
        acc[item.name] = item.url;
        return acc;
      }, {});
    },
    staleTime: 5 * 60 * 1000,
  });
}
