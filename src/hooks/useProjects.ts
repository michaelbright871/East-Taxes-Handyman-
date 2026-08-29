import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string | null;
  cover_url: string | null;
  description: string | null;
  property_type: string;
  is_featured: boolean;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data || []) as Project[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
