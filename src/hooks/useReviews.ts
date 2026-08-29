import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CustomerReview {
  id: string;
  author_name: string;
  author_location?: string;
  avatar_url?: string;
  rating: number;
  title?: string;
  body: string;
  service_name?: string;
  created_at: string;
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as CustomerReview[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
