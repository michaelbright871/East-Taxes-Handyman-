/**
 * Canonical media URLs for the public site.
 * These local public paths are production-safe and work reliably across Vercel,
 * browsers, and mobile Safari without depending on generated Lovable asset URLs.
 */

const LOCAL_MEDIA = {
  hero: "/videos/hero.mp4",
  services: "/videos/services.mp4",
  craftsmanship: "/videos/craftsmanship.mp4",
  carpentry: "/videos/carpentry.mp4",
  painting: "/videos/painting.mp4",
  exterior: "/videos/exterior.mp4",
  testimonials: "/videos/testimonials.mp4",
  contact: "/videos/contact.mp4",
} as const;

export function resolveMediaUrl(value: string | null | undefined, fallback: string): string {
  if (!value || typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const blockedPatterns = ["/__l5e/", "assets-v1", "lovable.dev", "localhost", "127.0.0.1"];
  if (blockedPatterns.some((pattern) => trimmed.toLowerCase().includes(pattern.toLowerCase()))) {
    return fallback;
  }

  return trimmed;
}

export const heroVideoUrl = LOCAL_MEDIA.hero;
export const servicesVideoUrl = LOCAL_MEDIA.services;
export const craftsmanshipVideoUrl = LOCAL_MEDIA.craftsmanship;
export const carpentryVideoUrl = LOCAL_MEDIA.carpentry;
export const paintingVideoUrl = LOCAL_MEDIA.painting;
export const exteriorVideoUrl = LOCAL_MEDIA.exterior;
export const testimonialsVideoUrl = LOCAL_MEDIA.testimonials;
export const contactVideoUrl = LOCAL_MEDIA.contact;
