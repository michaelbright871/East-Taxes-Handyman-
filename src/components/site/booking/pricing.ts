/**
 * Pricing model shared by the Instant Quote Estimator and the Repair Cost Calculator.
 * All figures are approximate planning ranges — never a binding quote.
 */

export interface ServicePrice {
  id: string;
  label: string;
  /** Base low/high price for a standard, single-room residential job. */
  base: [number, number];
  /** Base low/high crew hours for the same job. */
  hours: [number, number];
  /** Whether project size (rooms / areas) meaningfully scales the job. */
  scalesWithSize: boolean;
}

export const serviceCatalog: ServicePrice[] = [
  { id: "general-repairs", label: "General Home Repairs", base: [125, 400], hours: [2, 5], scalesWithSize: true },
  { id: "carpentry", label: "Carpentry", base: [250, 900], hours: [4, 12], scalesWithSize: true },
  { id: "drywall", label: "Drywall Repair", base: [175, 650], hours: [3, 8], scalesWithSize: true },
  { id: "interior-painting", label: "Interior Painting", base: [300, 950], hours: [6, 16], scalesWithSize: true },
  { id: "exterior-painting", label: "Exterior Painting", base: [650, 2400], hours: [12, 32], scalesWithSize: true },
  { id: "door-install", label: "Door Installation", base: [225, 750], hours: [3, 7], scalesWithSize: true },
  { id: "door-repair", label: "Door Repair", base: [120, 350], hours: [1, 4], scalesWithSize: false },
  { id: "window-repair", label: "Window Repair", base: [150, 500], hours: [2, 5], scalesWithSize: true },
  { id: "furniture-assembly", label: "Furniture Assembly", base: [90, 300], hours: [1, 4], scalesWithSize: true },
  { id: "plumbing", label: "Minor Plumbing Repairs", base: [140, 450], hours: [2, 5], scalesWithSize: false },
  { id: "electrical", label: "Light Electrical Fixtures", base: [130, 425], hours: [2, 5], scalesWithSize: true },
  { id: "flooring", label: "Flooring Repairs", base: [275, 1100], hours: [4, 14], scalesWithSize: true },
  { id: "fence-repair", label: "Fence Repair", base: [225, 1200], hours: [4, 14], scalesWithSize: true },
  { id: "deck-repair", label: "Deck Repair", base: [350, 1800], hours: [6, 20], scalesWithSize: true },
  { id: "pressure-washing", label: "Pressure Washing", base: [175, 600], hours: [2, 6], scalesWithSize: true },
  { id: "home-maintenance", label: "Home Maintenance", base: [150, 550], hours: [2, 6], scalesWithSize: true },
  { id: "property-improvements", label: "Property Improvements", base: [400, 2500], hours: [8, 28], scalesWithSize: true },
];

export const propertyTypes = [
  { id: "residential", label: "Residential", multiplier: 1 },
  { id: "commercial", label: "Commercial", multiplier: 1.25 },
] as const;

export const projectSizes = [
  { id: "small", label: "Small · 1 room or area", multiplier: 1 },
  { id: "medium", label: "Medium · 2–3 rooms or areas", multiplier: 1.75 },
  { id: "large", label: "Large · 4–6 rooms or areas", multiplier: 2.75 },
  { id: "whole", label: "Whole property", multiplier: 4 },
] as const;

export const complexities = [
  { id: "simple", label: "Simple · cosmetic or straightforward", multiplier: 0.85 },
  { id: "standard", label: "Standard · typical repair", multiplier: 1 },
  { id: "complex", label: "Complex · structural, damage or custom", multiplier: 1.4 },
] as const;

export const urgencies = [
  {
    id: "standard",
    label: "Standard",
    note: "Scheduled within 5–10 days",
    multiplier: 1,
    leadTime: "5–10 days",
  },
  {
    id: "priority",
    label: "Priority",
    note: "Scheduled within 48 hours",
    multiplier: 1.15,
    leadTime: "24–48 hours",
  },
  {
    id: "emergency",
    label: "Emergency",
    note: "Same-day response when available",
    multiplier: 1.4,
    leadTime: "Same day",
  },
] as const;

export type PropertyTypeId = (typeof propertyTypes)[number]["id"];
export type ProjectSizeId = (typeof projectSizes)[number]["id"];
export type ComplexityId = (typeof complexities)[number]["id"];
export type UrgencyId = (typeof urgencies)[number]["id"];

export interface EstimateInput {
  serviceIds: string[];
  propertyType: PropertyTypeId;
  size: ProjectSizeId;
  complexity: ComplexityId;
  urgency: UrgencyId;
}

export interface EstimateResult {
  low: number;
  high: number;
  hoursLow: number;
  hoursHigh: number;
  duration: string;
  leadTime: string;
  recommended: string | null;
}

const round = (value: number) => Math.max(75, Math.round(value / 5) * 5);

function describeDuration(hoursLow: number, hoursHigh: number) {
  if (hoursHigh <= 4) return "Half a day on site";
  if (hoursHigh <= 8) return "About one working day";
  const daysLow = Math.max(1, Math.round(hoursLow / 8));
  const daysHigh = Math.max(daysLow + 1, Math.round(hoursHigh / 8));
  return `${daysLow}–${daysHigh} working days`;
}

export function calculateEstimate(input: EstimateInput): EstimateResult | null {
  const selected = serviceCatalog.filter((service) => input.serviceIds.includes(service.id));
  if (selected.length === 0) return null;

  const property = propertyTypes.find((p) => p.id === input.propertyType)!;
  const size = projectSizes.find((s) => s.id === input.size)!;
  const complexity = complexities.find((c) => c.id === input.complexity)!;
  const urgency = urgencies.find((u) => u.id === input.urgency)!;

  let low = 0;
  let high = 0;
  let hoursLow = 0;
  let hoursHigh = 0;

  selected.forEach((service, index) => {
    const sizeFactor = service.scalesWithSize ? size.multiplier : 1;
    // Bundling several services into one visit trims mobilisation cost.
    const bundle = index === 0 ? 1 : 0.9;
    const factor = sizeFactor * complexity.multiplier * property.multiplier * urgency.multiplier * bundle;
    low += service.base[0] * factor;
    high += service.base[1] * factor;
    hoursLow += service.hours[0] * sizeFactor * complexity.multiplier * bundle;
    hoursHigh += service.hours[1] * sizeFactor * complexity.multiplier * bundle;
  });

  const sortedByValue = [...selected].sort((a, b) => b.base[1] - a.base[1]);

  return {
    low: round(low),
    high: round(high),
    hoursLow: Math.round(hoursLow),
    hoursHigh: Math.round(hoursHigh),
    duration: describeDuration(hoursLow, hoursHigh),
    leadTime: urgency.leadTime,
    recommended: sortedByValue[0]?.label ?? null,
  };
}

export const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const timeSlots = [
  "7:00 AM – 9:00 AM",
  "9:00 AM – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "1:00 PM – 3:00 PM",
  "3:00 PM – 5:00 PM",
];

export function serviceLabel(id: string) {
  return serviceCatalog.find((s) => s.id === id)?.label ?? id;
}

export function makeBookingId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `ETH-${stamp}${rand}`;
}
