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
  dateMonthsAgo: number;
  date: string;
}

const formatRelativeDate = (monthsAgo: number) => {
  const years = Math.floor(monthsAgo / 12);
  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }

  return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
};

const createAvatar = (name: string, from: string, to: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="32" fill="url(#g)"/>
      <circle cx="64" cy="52" r="20" fill="rgba(255,255,255,0.18)"/>
      <path d="M31 98c7-15 19-22 33-22s26 7 33 22" fill="rgba(255,255,255,0.18)"/>
      <text x="64" y="74" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="white">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const googleReviews: CustomerReview[] = [
  {
    id: "r1",
    name: "Kevin Willis",
    location: "Longview, TX",
    service: "Full Home Renovation & Carpentry",
    rating: 5,
    text: "This team was simply amazing and incredibly talented. They went the extra mile in everything they did, and I could not be more happy with how they handled the entire project. They were true professionals at every stage. I am 120% happy with the results, and if you need anything done, these are the best people to complete your project. I would give them 16 stars out of 10. Truly amazing. Thank you so much for everything you did. I will tell everyone I know, and if you need anything done, this team is the best. Thank you for everything — well done!",
    avatar: createAvatar("Kevin Willis", "#7c3aed", "#ec4899"),
    dateMonthsAgo: 10,
    date: formatRelativeDate(10),
  },
  {
    id: "r2",
    name: "Donald Brown",
    location: "Longview, TX",
    service: "Exterior Repairs & Siding",
    rating: 5,
    text: "I had about $7,000 of exterior work done to my home this April. From dry rot repair and replacement to extensive siding replacement and trim work, including replacing and painting, to two new wooden gates, all of the work was done excellently and professionally. Thank you again.\n\nWayne Brown",
    avatar: createAvatar("Donald Brown", "#0f766e", "#14b8a6"),
    dateMonthsAgo: 24,
    date: formatRelativeDate(24),
  },
  {
    id: "r3",
    name: "Viki Cain",
    location: "Longview, TX",
    service: "Bathroom Vent & Ceiling Repair",
    rating: 5,
    text: "A wonderful duo who do quality work in a timely manner. They replaced the ceiling and installed a new vent as well as a vent fan and light combo in my bathroom. The work is beautiful, and I must add that they are two really nice young people. Thank you both — you really helped this old lady out!",
    avatar: createAvatar("Viki Cain", "#f59e0b", "#f97316"),
    dateMonthsAgo: 36,
    date: formatRelativeDate(36),
  },
  {
    id: "r4",
    name: "Mercedes Kotchev",
    location: "Longview, TX",
    service: "Plumbing & Exterior Fixes",
    rating: 5,
    text: "GREAT handyman. We will be using his services for all of our needs from now on. He really went above and beyond, literally on the roof to fix our plumbing issues. He was professional and nice, and he even fixed a few things we did not even realize needed to be fixed. We will definitely use him in the future, and you should too. He will not disappoint!",
    avatar: createAvatar("Mercedes Kotchev", "#2563eb", "#8b5cf6"),
    dateMonthsAgo: 48,
    date: formatRelativeDate(48),
  },
  {
    id: "r5",
    name: "Sabrina Siddique",
    location: "Longview, TX",
    service: "Residential & Business Handyman Work",
    rating: 5,
    text: "Very professional. I would highly recommend him for both personal and business needs. I have called many handymen in the past, and I have never dealt with anyone this professional and talented. He won't leave the job until it is absolutely perfect.",
    avatar: createAvatar("Sabrina Siddique", "#ef4444", "#f97316"),
    dateMonthsAgo: 48,
    date: formatRelativeDate(48),
  },
  {
    id: "r6",
    name: "Byron Owens",
    location: "Longview, TX",
    service: "Mailbox & Exterior Installation",
    rating: 5,
    text: "ETHS got us on their schedule quickly and had the job done before we knew it. Professional workers and professional work. We had them install a new post and mailbox for us, and we will definitely be utilizing their services again on our property. Great price and a great experience.",
    avatar: createAvatar("Byron Owens", "#2563eb", "#0ea5e9"),
    dateMonthsAgo: 11,
    date: formatRelativeDate(11),
  },
  {
    id: "r7",
    name: "Carla Peoples",
    location: "Longview, TX",
    service: "Large Remodeling Project",
    rating: 5,
    text: "He is a very professional contractor. There is no limit to what he can do. There is no need to piece-meal a job when he can do everything himself. I had a huge remodeling project that lasted at least four to five weeks. I never had a worry knowing he was on the job. He even took time to entertain my three-year-old granddaughter, who constantly wanted to help him. I will definitely be using him again for any future projects I might have. I highly recommend him for any home project you might have.",
    avatar: createAvatar("Carla Peoples", "#a855f7", "#ec4899"),
    dateMonthsAgo: 48,
    date: formatRelativeDate(48),
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
