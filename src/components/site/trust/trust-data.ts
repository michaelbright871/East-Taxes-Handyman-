import { paintingVideoUrl, carpentryVideoUrl, exteriorVideoUrl } from "@/content/media";

/**
 * Central source of truth for all trust & credibility content.
 * Every value here is designed to be editable later from an admin control center
 * without touching component code.
 */

export const googleBusiness = {
  rating: 4.9,
  totalReviews: 187,
  profileUrl:
    "https://www.google.com/maps/search/?api=1&query=2505+Clinton+St+Longview+TX+75604",
  writeReviewUrl:
    "https://www.google.com/maps/search/?api=1&query=2505+Clinton+St+Longview+TX+75604",
  /** Star distribution, 5 → 1. */
  distribution: [
    { stars: 5, count: 168 },
    { stars: 4, count: 14 },
    { stars: 3, count: 3 },
    { stars: 2, count: 1 },
    { stars: 1, count: 1 },
  ],
  satisfaction: 98,
};

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  /** Optional avatar image URL — initials are used when omitted. */
  avatar?: string;
  date: string;
}

export const googleReviews: CustomerReview[] = [
  {
    id: "r1",
    name: "Amanda Rowland",
    location: "Longview, TX",
    service: "Drywall Repair & Interior Painting",
    rating: 5,
    text: "They patched drywall in two rooms, rehung a sticking exterior door and painted our hallway in a single visit. Honest pricing quoted up front, no surprises, and they cleaned every speck of dust before leaving.",
    date: "3 weeks ago",
  },
  {
    id: "r2",
    name: "Dwight Carrington",
    location: "Kilgore, TX",
    service: "Rental Make-Ready",
    rating: 5,
    text: "I manage nine rentals and needed a make-ready fast. Flooring repair, fixture swaps and touch-up paint finished a day ahead of schedule. Reliable, professional and they text updates as they go.",
    date: "1 month ago",
  },
  {
    id: "r3",
    name: "Kelsey Mabry",
    location: "Tyler, TX",
    service: "Fence Gate Rebuild & Pressure Washing",
    rating: 5,
    text: "Rebuilt a sagging gate and pressure washed the driveway and patio before a listing shoot. On time, spotless workmanship, and the curb appeal difference genuinely helped sell the house.",
    date: "1 month ago",
  },
  {
    id: "r4",
    name: "Marcus Whitfield",
    location: "Gladewater, TX",
    service: "Deck Repair",
    rating: 5,
    text: "Replaced rotted deck boards and re-anchored the railing. Quote was fair and did not change, crew showed up exactly when they said, and the finish work matches the original deck perfectly.",
    date: "2 months ago",
  },
  {
    id: "r5",
    name: "Terri Vaughn",
    location: "Hallsville, TX",
    service: "Emergency Storm Repair",
    rating: 5,
    text: "Storm took out a section of siding and a door frame. They answered after hours and had us secured the same evening. That kind of responsiveness is rare — we've used them three times since.",
    date: "2 months ago",
  },
  {
    id: "r6",
    name: "Jonathan Pike",
    location: "White Oak, TX",
    service: "Home Maintenance Plan",
    rating: 4,
    text: "Quality of work is excellent and the technicians are courteous and clearly vetted. Scheduling took an extra day during their busy season, but the results were worth the short wait.",
    date: "3 months ago",
  },
];

export interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  summary: string;
  videoSrc: string;
  poster: string;
}

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "v1",
    name: "The Rowland Family",
    location: "Longview, TX",
    service: "Interior Repairs & Painting",
    summary:
      "\"Two rooms of drywall and a full hallway repaint — finished in a day and priced exactly as quoted.\"",
    videoSrc: paintingVideoUrl,
    poster: "/videos/painting-poster.jpg",
  },
  {
    id: "v2",
    name: "Carrington Property Group",
    location: "Kilgore, TX",
    service: "Rental Turnovers",
    summary:
      "\"Our make-ready turnaround dropped from ten days to four. They're the only crew we call now.\"",
    videoSrc: carpentryVideoUrl,
    poster: "/videos/carpentry-poster.jpg",
  },
  {
    id: "v3",
    name: "Kelsey M.",
    location: "Tyler, TX",
    service: "Exterior Restoration",
    summary:
      "\"Gate rebuild plus pressure washing before listing photos. The curb appeal difference was immediate.\"",
    videoSrc: exteriorVideoUrl,
    poster: "/videos/exterior-poster.jpg",
  },
];

export interface CustomerStory {
  id: string;
  title: string;
  customer: string;
  location: string;
  problem: string;
  solution: string;
  work: string[];
  feedback: string;
  outcome: string;
}

export const customerStories: CustomerStory[] = [
  {
    id: "s1",
    title: "Water-Damaged Living Room Restored in 48 Hours",
    customer: "Amanda R.",
    location: "Longview, TX",
    problem:
      "A slow supply-line leak soaked drywall, baseboards and a section of laminate flooring behind the living room wall.",
    solution:
      "We isolated the leak, dried the cavity, replaced the damaged materials and colour-matched the existing paint and trim profile.",
    work: [
      "Drywall cut-out, replacement and texture match",
      "Baseboard and trim carpentry",
      "Laminate plank replacement",
      "Full-wall repaint with colour match",
    ],
    feedback:
      "\"You cannot tell anything ever happened. They kept us updated every step and the final bill matched the estimate.\"",
    outcome: "Completed in 2 days · Insurance-ready photo documentation provided",
  },
  {
    id: "s2",
    title: "Nine-Unit Rental Portfolio Turned Make-Ready",
    customer: "Carrington Property Group",
    location: "Kilgore, TX",
    problem:
      "Vacancy turnarounds were taking over a week per unit, with multiple trades to coordinate and inconsistent finish quality.",
    solution:
      "We built a standard make-ready checklist and handled repairs, fixtures, paint and flooring with one accountable crew.",
    work: [
      "Drywall and door repairs across 9 units",
      "Fixture and hardware replacement",
      "Flooring repair and deep touch-up paint",
      "Punch-list walkthrough with the property manager",
    ],
    feedback:
      "\"One crew, one invoice, one point of contact. Our turn time was cut by more than half.\"",
    outcome: "Turnaround reduced from 10 days to 4 · Ongoing maintenance partner",
  },
  {
    id: "s3",
    title: "Storm Damage Secured the Same Evening",
    customer: "Terri V.",
    location: "Hallsville, TX",
    problem:
      "High winds tore away siding and twisted an exterior door frame, leaving the home exposed overnight.",
    solution:
      "Our emergency crew responded after hours to secure the opening, then returned to complete permanent repairs.",
    work: [
      "Emergency board-up and weather sealing",
      "Door frame rebuild and rehang",
      "Siding replacement and paint blend",
    ],
    feedback:
      "\"They answered the phone at 8pm and were here before dark. We've used them three times since.\"",
    outcome: "Secured same day · Permanent repair completed within 72 hours",
  },
];

export interface TrustStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export const trustStats: TrustStat[] = [
  {
    id: "years",
    value: 18,
    suffix: "+",
    label: "Years in Business",
    description: "Serving Longview and East Texas since 2008.",
  },
  {
    id: "projects",
    value: 4200,
    suffix: "+",
    label: "Projects Completed",
    description: "Repairs, remodels and maintenance calls finished.",
  },
  {
    id: "customers",
    value: 3100,
    suffix: "+",
    label: "Happy Customers",
    description: "Homeowners, landlords and local businesses served.",
  },
  {
    id: "response",
    value: 24,
    suffix: "/7",
    label: "Emergency Availability",
    description: "Urgent repair line answered around the clock.",
  },
];

export interface Brand {
  name: string;
  category: string;
  supplier: string;
  domain: string;
}

export const brands: Brand[] = [
  { name: "DeWalt", category: "Power Tools", supplier: "Acme Tools", domain: "dewalt.com" },
  { name: "Milwaukee", category: "Power Tools", supplier: "Home Depot Pro", domain: "milwaukeetool.com" },
  { name: "Sherwin-Williams", category: "Paint & Coatings", supplier: "Longview Store", domain: "sherwin-williams.com" },
  { name: "Behr", category: "Paint & Coatings", supplier: "Home Depot Pro", domain: "behr.com" },
  { name: "Kohler", category: "Fixtures", supplier: "Ferguson", domain: "kohler.com" },
  { name: "Moen", category: "Fixtures", supplier: "Ferguson", domain: "moen.com" },
  { name: "Simpson Strong-Tie", category: "Structural Hardware", supplier: "McCoy's", domain: "strongtie.com" },
  { name: "James Hardie", category: "Siding & Exterior", supplier: "McCoy's", domain: "jameshardie.com" },
  { name: "Trex", category: "Decking", supplier: "McCoy's", domain: "trex.com" },
  { name: "USG Sheetrock", category: "Drywall", supplier: "L&W Supply", domain: "usg.com" },
  { name: "Schlage", category: "Door Hardware", supplier: "Ferguson", domain: "schlage.com" },
  { name: "Titebond", category: "Adhesives", supplier: "Acme Tools", domain: "titebond.com" },
];

export const guarantees = [
  {
    title: "100% Satisfaction Guarantee",
    body: "If any part of the finished work does not meet what we agreed on, we return and correct it at no additional charge — no debate, no invoice.",
  },
  {
    title: "Upfront Honest Pricing",
    body: "You approve a written estimate before we start. The price you approve is the price you pay unless you request additional work in writing.",
  },
  {
    title: "On-Time Completion Promise",
    body: "We commit to an arrival window and a completion date. If we're running behind, you hear it from us first — not after the fact.",
  },
  {
    title: "Clean-Site Commitment",
    body: "Floors covered, tools packed and debris removed at the end of every visit. Your home is left cleaner than we found it.",
  },
];

export const warranty = {
  headline: "1-Year Workmanship Warranty",
  intro:
    "Every repair, installation and finish we complete is covered against defects in workmanship for a full 12 months from the completion date.",
  covered: [
    "Carpentry, framing and trim installation",
    "Drywall repair, texture and finish work",
    "Interior and exterior painting application",
    "Door, window and hardware installation",
    "Fence, deck and exterior repair labour",
    "Fixture, faucet and hardware installation labour",
  ],
  notes:
    "Manufacturer warranties on materials and fixtures are passed through to you in full. Normal wear, owner modifications and storm or accident damage are handled as new work.",
};

export const credentials = [
  {
    id: "licensed",
    title: "Licensed",
    body: "Operating as a licensed contractor for handyman and home repair services across Gregg County and East Texas.",
  },
  {
    id: "insured",
    title: "Fully Insured",
    body: "General liability coverage carried on every job, with certificates available to homeowners and property managers on request.",
  },
  {
    id: "vetted",
    title: "Background-Checked Technicians",
    body: "Every technician passes a criminal background check, is drug screened and arrives in uniform with photo identification.",
  },
  {
    id: "local",
    title: "Locally Owned & Operated",
    body: "Based at 2505 Clinton St in Longview, serving Kilgore, Gladewater, White Oak, Hallsville, Marshall and Tyler.",
  },
];
