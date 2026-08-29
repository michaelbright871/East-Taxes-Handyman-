import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      return (data || []).reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
    },
    staleTime: 5 * 60 * 1000,
  });
}
