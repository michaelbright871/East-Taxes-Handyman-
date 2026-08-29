import type { ImageTag } from "./knowledge";

import carpentry from "@/assets/service-carpentry.jpg";
import drywall from "@/assets/service-drywall.jpg";
import painting from "@/assets/service-painting.jpg";
import exteriorPainting from "@/assets/service-exterior-painting.jpg";
import doors from "@/assets/service-doors.jpg";
import windows from "@/assets/service-windows.jpg";
import flooring from "@/assets/service-flooring.jpg";
import fence from "@/assets/service-fence.jpg";
import deck from "@/assets/service-deck.jpg";
import pressureWashing from "@/assets/service-pressure-washing.jpg";
import generalRepairs from "@/assets/service-general-repairs.jpg";
import homeMaintenance from "@/assets/service-home-maintenance.jpg";
import fixtures from "@/assets/service-fixtures-assembly.jpg";

/** Reference photos the assistant can attach inline. */
export const referenceImages: Record<ImageTag, { src: string; alt: string }> = {
  carpentry: { src: carpentry, alt: "Carpentry repair work in progress" },
  drywall: { src: drywall, alt: "Drywall patch being finished" },
  painting: { src: painting, alt: "Interior painting prep and cut-in" },
  "exterior-painting": { src: exteriorPainting, alt: "Exterior repaint on an East Texas home" },
  doors: { src: doors, alt: "Interior door being hung and adjusted" },
  windows: { src: windows, alt: "Window maintenance and re-sealing" },
  flooring: { src: flooring, alt: "Flooring installation and repair" },
  fence: { src: fence, alt: "Fence panel and post repair" },
  deck: { src: deck, alt: "Deck board replacement and refinishing" },
  "pressure-washing": { src: pressureWashing, alt: "Pressure washing a driveway" },
  "general-repairs": { src: generalRepairs, alt: "General home repair punch list" },
  "home-maintenance": { src: homeMaintenance, alt: "Seasonal home maintenance check" },
  fixtures: { src: fixtures, alt: "Fixture install and furniture assembly" },
  tools: { src: generalRepairs, alt: "Basic hand tools for a small repair" },
};
