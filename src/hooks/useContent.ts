import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentBlockData {
  title?: string;
  body?: string;
  eyebrow?: string;
  content?: string;
  [key: string]: any;
}

export function useContent(section: string) {
  return useQuery({
    queryKey: ["content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("section", section)
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Transform list into a key-value map for easy access
      return (data || []).reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.data;
        return acc;
      }, {});
    },
    staleTime: 60 * 1000,
  });
}

export function useContentBlock(key: string) {
  return useQuery({
    queryKey: ["content-block", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return (data?.data as ContentBlockData) ?? null;
    },
    staleTime: 60 * 1000,
  });
}
