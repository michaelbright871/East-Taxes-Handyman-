/**
 * Central registry for the site's background and testimonial videos.
 * Each clip is stored as a CDN asset pointer so large media never lives in the repo.
 */
import heroAsset from "@/assets/videos/hero.mp4.asset.json";
import servicesAsset from "@/assets/videos/services.mp4.asset.json";
import craftsmanshipAsset from "@/assets/videos/craftsmanship.mp4.asset.json";
import carpentryAsset from "@/assets/videos/carpentry.mp4.asset.json";
import paintingAsset from "@/assets/videos/painting.mp4.asset.json";
import exteriorAsset from "@/assets/videos/exterior.mp4.asset.json";
import testimonialsAsset from "@/assets/videos/testimonials.mp4.asset.json";
import contactAsset from "@/assets/videos/contact.mp4.asset.json";

export const heroVideoUrl = heroAsset.url;
export const servicesVideoUrl = servicesAsset.url;
export const craftsmanshipVideoUrl = craftsmanshipAsset.url;
export const carpentryVideoUrl = carpentryAsset.url;
export const paintingVideoUrl = paintingAsset.url;
export const exteriorVideoUrl = exteriorAsset.url;
export const testimonialsVideoUrl = testimonialsAsset.url;
export const contactVideoUrl = contactAsset.url;
