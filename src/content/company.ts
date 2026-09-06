import {
  Award,
  BadgeCheck,
  Clock,
  DollarSign,
  HardHat,
  Handshake,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Ruler,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import ownerImage from "@/assets/team-owner.jpg";
import finishImage from "@/assets/team-finish.jpg";
import exteriorLeadImage from "@/assets/team-exterior.jpg";
import schedulingImage from "@/assets/team-scheduling.jpg";
import interiorRefreshImage from "@/assets/project-interior-refresh.jpg";
import deckRebuildImage from "@/assets/project-deck-rebuild.jpg";
import rentalTurnoverImage from "@/assets/project-rental-turnover.jpg";
import fenceLineImage from "@/assets/project-fence-line.jpg";
import trimBuiltinsImage from "@/assets/project-trim-builtins.jpg";
import exteriorRepaintImage from "@/assets/project-exterior-repaint.jpg";

export const companyIntro = {
  heading: "A Local Handyman Crew East Texas Homeowners Actually Trust",
  body: [
    "East Texas Handyman Services was built on a simple frustration: it is too hard to find someone who shows up when they said they would, quotes an honest price, and finishes the work properly. We started taking on the jobs other contractors called too small, and word spread.",
    "Today we serve homeowners, landlords, property managers, real estate agents, and small businesses across Longview, Kilgore, Gladewater, Tyler, Marshall, and the surrounding communities — with the same phone number, the same crew, and the same standard on every job.",
  ],
};

// whyChooseUs removed per request

export const howItWorks: { icon: LucideIcon; step: string; title: string; copy: string }[] = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Contact Us",
    copy: "Call, text, or send the online request with a short description and a few photos of the problem.",
  },
  {
    icon: Ruler,
    step: "02",
    title: "Free Estimate",
    copy: "We review the scope — in person or from your photos — and send a clear written price with no obligation.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Schedule the Work",
    copy: "You choose the day and arrival window. We confirm ahead of time and show up when we said we would.",
  },
  {
    icon: Wrench,
    step: "04",
    title: "We Complete the Job",
    copy: "The right tools and materials on the truck, tidy work habits, and updates if anything changes.",
  },
  {
    icon: Handshake,
    step: "05",
    title: "Final Walkthrough",
    copy: "We inspect the finished work with you, clean up fully, and stand behind it for a full year.",
  },
];

export const history: { year: string; title: string; copy: string }[] = [
  {
    year: "2010",
    title: "First Tools, First Customers",
    copy: "Started with weekend repair work for neighbors in Longview — doors, drywall, and honest pricing.",
  },
  {
    year: "2014",
    title: "Full-Time and Word of Mouth",
    copy: "Repeat homeowners and a growing referral list turned side work into a full-time trade business.",
  },
  {
    year: "2018",
    title: "Property Managers Come On Board",
    copy: "Landlords and agents began using us for turnovers and make-ready work on tight listing deadlines.",
  },
  {
    year: "2021",
    title: "A Second Crew",
    copy: "Added crew capacity so exterior painting, decks, and fences could run alongside interior repairs.",
  },
  {
    year: "2026",
    title: "Serving All of East Texas",
    copy: "Longview, Kilgore, Gladewater, White Oak, Hallsville, Marshall, Tyler, Henderson and beyond.",
  },
];

export const mission = {
  mission:
    "To make quality home repair simple and stress-free for East Texas families — clear pricing, dependable scheduling, and work we would be proud to have in our own homes.",
  vision:
    "To be the first name East Texas homeowners, landlords, and small businesses think of when something needs fixing, improving, or maintaining.",
};

export const coreValues: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: HeartHandshake,
    title: "Honesty",
    copy: "If a repair is cheaper than a replacement, we say so. If a job needs a licensed specialist, we tell you.",
  },
  {
    icon: Award,
    title: "Quality Craftsmanship",
    copy: "Measured, level, sealed, and finished. Details you cannot see matter as much as the ones you can.",
  },
  {
    icon: Clock,
    title: "Reliability",
    copy: "Answered calls, kept appointments, and realistic timelines you can plan your week around.",
  },
  {
    icon: Users,
    title: "Respect",
    copy: "Your home, your time, and your budget treated carefully from the first call to the final walkthrough.",
  },
];

export const team: { name: string; role: string; bio: string; specialties: string[]; image: string }[] = [
  {
    name: "Marcus Bell",
    role: "Owner & Lead Craftsman",
    bio: "Fifteen years in carpentry and home repair. Marcus estimates most jobs personally and works on site with the crew.",
    specialties: ["Carpentry", "Doors & Windows", "Estimating"],
    image: ownerImage,
    
  },
  {
    name: "Trey Alvarado",
    role: "Finish & Paint Lead",
    bio: "Drywall finishing and painting specialist known for texture matching that disappears under a fresh coat.",
    specialties: ["Drywall", "Interior Painting", "Texture Matching"],
    image: finishImage,
  },
  {
    name: "Dale Whitfield",
    role: "Exterior & Deck Specialist",
    bio: "Handles decks, fences, exterior painting, and pressure washing — everything the East Texas weather works on.",
    specialties: ["Decks", "Fences", "Pressure Washing"],
    image: exteriorLeadImage,
  },
  {
    name: "Renee Carter",
    role: "Scheduling & Client Care",
    bio: "Answers the phone, books the arrival windows, and keeps property managers updated on every turnover.",
    specialties: ["Scheduling", "Estimates", "Property Managers"],
    image: schedulingImage,
  },
];

export const certifications: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: ShieldCheck,
    title: "General Liability Insured",
    copy: "Active general liability coverage on every job. Certificate of insurance available on request.",
  },
  {
    icon: BadgeCheck,
    title: "Licensed Where Required",
    copy: "Operating in compliance with Texas requirements for handyman and home repair work, with licensed specialists brought in for electrical, HVAC, and major plumbing.",
  },
  {
    icon: HardHat,
    title: "Safety Trained Crew",
    copy: "Ladder, power tool, and fall-protection practices reviewed with every crew member on the job site.",
  },
  {
    icon: Award,
    title: "1-Year Workmanship Warranty",
    copy: "If our workmanship fails within twelve months, we come back and correct it at no charge.",
  },
];

export const safetyStandards = [
  "Job-site walkthrough and hazard check before work begins",
  "Drop cloths, plastic sheeting, and dust control inside occupied homes",
  "Rated ladders, fall protection, and tool inspection on every exterior job",
  "Utility and stud location checks before cutting or drilling",
  "Debris contained daily and hauled away at completion",
  "Background-checked crew members in your home",
];

export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  duration: string;
  image: string;
  challenge: string;
  solution: string;
  result: string;
}

export const featuredProjects: Project[] = [
  {
    slug: "longview-kitchen-refresh",
    title: "Whole-Home Interior Refresh",
    category: "Painting & Drywall",
    location: "Longview, TX",
    duration: "5 days",
    image: interiorRefreshImage,
    challenge:
      "A 1980s home going on the market had settling cracks, nail pops, and dated color across every room.",
    solution:
      "Patched and texture-matched every wall and ceiling, caulked all trim, then applied two coats of a neutral, listing-friendly palette.",
    result: "Listed four days after completion and went under contract the first weekend.",
  },
  {
    slug: "kilgore-deck-rebuild",
    title: "Deck Rebuild & Seal",
    category: "Deck Repair",
    location: "Kilgore, TX",
    duration: "3 days",
    image: deckRebuildImage,
    challenge: "Soft boards, a wobbly railing, and a stair stringer that had rotted where it met the ground.",
    solution:
      "Replaced 40% of the decking and the failed stringer, re-anchored the railing posts, then sanded and sealed the full surface.",
    result: "A safe, level deck the family uses year round, at roughly a third of full rebuild cost.",
  },
  {
    slug: "gladewater-rental-turnover",
    title: "Two-Unit Rental Turnover",
    category: "Make-Ready",
    location: "Gladewater, TX",
    duration: "6 days",
    image: rentalTurnoverImage,
    challenge: "Two units vacated the same week with drywall damage, worn flooring, and failing door hardware.",
    solution:
      "Sequenced drywall, paint, flooring sections, and hardware replacement across both units with daily photo updates to the owner.",
    result: "Both units re-listed within a week, with no return visits needed.",
  },
  {
    slug: "hallsville-fence-line",
    title: "Storm-Damaged Fence Line",
    category: "Fence Repair",
    location: "Hallsville, TX",
    duration: "2 days",
    image: fenceLineImage,
    challenge: "A fallen limb took out three sections and left two posts leaning badly after a spring storm.",
    solution: "Reset posts in concrete, rebuilt the damaged sections with matching pickets, and re-hung the gate square.",
    result: "Fence line straight again and blended so the repair is hard to spot from the yard.",
  },
  {
    slug: "tyler-trim-package",
    title: "Custom Trim & Built-Ins",
    category: "Carpentry",
    location: "Tyler, TX",
    duration: "4 days",
    image: trimBuiltinsImage,
    challenge: "A bare living room needed storage without a full remodel budget.",
    solution: "Built floor-to-ceiling shelving flanking the fireplace, added crown and upgraded door casing throughout.",
    result: "The room reads custom-built, finished for a fraction of a cabinet shop quote.",
  },
  {
    slug: "white-oak-exterior",
    title: "Exterior Wash & Repaint",
    category: "Exterior Painting",
    location: "White Oak, TX",
    duration: "5 days",
    image: exteriorRepaintImage,
    challenge: "Chalking paint, mildew on the north face, and several rotted trim boards.",
    solution: "Soft-washed the entire exterior, replaced rot, primed bare wood, and applied two coats of UV-stable finish.",
    result: "A sealed, protected exterior that erased fifteen years of weathering.",
  },
];

export const recentJobs: { title: string; location: string; date: string; blurb: string }[] = [
  { title: "Ceiling drywall repair after a roof leak", location: "Longview", date: "This week", blurb: "Patched, textured, and repainted a 6' section in a hallway ceiling." },
  { title: "Two exterior doors installed", location: "Kilgore", date: "This week", blurb: "Pre-hung units set plumb, sealed, and fitted with new deadbolts." },
  { title: "Driveway and walkway pressure wash", location: "White Oak", date: "Last week", blurb: "Surface-cleaned 1,200 sq ft of concrete and treated oil staining." },
  { title: "Sagging gate rebuilt", location: "Hallsville", date: "Last week", blurb: "New bracing, hinges, and latch — gate swings free again." },
  { title: "Rental make-ready punch list", location: "Gladewater", date: "Last week", blurb: "Twenty-one line items closed out in three days before listing." },
  { title: "Kitchen faucet and disposal replacement", location: "Marshall", date: "Two weeks ago", blurb: "Old unit removed, new disposal wired and supply lines replaced." },
];

export const brochure = {
  title: "Service & Pricing Brochure",
  copy:
    "A printable overview of every service we offer, typical price ranges, our process, and warranty details — handy for planning a project or sharing with an owner.",
  note: "Digital brochure coming soon. Request a copy and we will email it the same day.",
};
