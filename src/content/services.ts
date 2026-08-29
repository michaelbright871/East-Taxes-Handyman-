import {
  Armchair,
  Blinds,
  Brush,
  DoorOpen,
  Droplets,
  Fence,
  Hammer,
  Home,
  Layers,
  Lightbulb,
  PaintRoller,
  Sparkles,
  Trees,
  Wrench,
  Wallpaper,
  type LucideIcon,
} from "lucide-react";

import generalRepairsImage from "@/assets/service-general-repairs.jpg";
import carpentryImage from "@/assets/service-carpentry.jpg";
import drywallImage from "@/assets/service-drywall.jpg";
import paintingImage from "@/assets/service-painting.jpg";
import exteriorPaintingImage from "@/assets/service-exterior-painting.jpg";
import doorsImage from "@/assets/service-doors.jpg";
import windowsImage from "@/assets/service-windows.jpg";
import flooringImage from "@/assets/service-flooring.jpg";
import fenceImage from "@/assets/service-fence.jpg";
import deckImage from "@/assets/service-deck.jpg";
import washImage from "@/assets/service-pressure-washing.jpg";
import maintenanceImage from "@/assets/service-home-maintenance.jpg";
import improvementsImage from "@/assets/service-property-improvements.jpg";
import fixturesImage from "@/assets/service-fixtures-assembly.jpg";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceComparison {
  title: string;
  optionA: { label: string; points: string[] };
  optionB: { label: string; points: string[] };
  guidance: string;
}

export interface ServiceContent {
  slug: string;
  /** Matches an id in booking/pricing.ts where possible. */
  quoteId: string;
  icon: LucideIcon;
  title: string;
  short: string;
  image: string;
  overview: string[];
  /** Editable from the Admin Control Center in a future phase. */
  duration: string;
  pricing: { startingFrom: string; typicalRange: string };
  benefits: { title: string; copy: string }[];
  commonRepairs: string[];
  process: { step: string; copy: string }[];
  faqs: ServiceFaq[];
  comparison?: ServiceComparison;
  related: string[];
  featured?: boolean;
}

const standardProcess = (work: string) => [
  { step: "Contact Us", copy: "Call, text, or send the request form with a few photos of the area." },
  { step: "Free Estimate", copy: "We review the scope and send a clear written price with no obligation." },
  { step: "Schedule", copy: "You pick the day and arrival window that fits your schedule." },
  { step: "Complete the Work", copy: work },
  { step: "Final Walkthrough", copy: "We inspect the finished work with you and clean the job site." },
];

export const services: ServiceContent[] = [
  {
    slug: "general-home-repairs",
    quoteId: "general-repairs",
    icon: Home,
    title: "General Home Repairs",
    short:
      "One dependable call for the punch list — squeaky doors, loose fixtures, worn trim, and the small repairs that add up.",
    image: generalRepairsImage,
    featured: true,
    duration: "Same Day",
    pricing: { startingFrom: "$125", typicalRange: "$125 – $400" },
    overview: [
      "Most homes collect a running list of small problems: a door that won't latch, a wobbly handrail, a cabinet hinge that sags, caulk that has pulled away from the tub. Individually they are minor. Together they wear on the house and on you.",
      "Our general repair visits are built for exactly that list. One scheduled visit, one crew, and a checklist worked through top to bottom with the right tools already on the truck.",
    ],
    benefits: [
      { title: "Quality", copy: "Repairs made with proper fasteners and materials instead of temporary fixes." },
      { title: "Safety", copy: "Loose railings, trip hazards, and failing hardware corrected before they cause injury." },
      { title: "Long-term value", copy: "Small issues handled early keep them from turning into structural or water damage." },
    ],
    commonRepairs: [
      "Sticking or misaligned doors and cabinet hardware",
      "Loose handrails, banisters, and stair treads",
      "Worn caulk around tubs, sinks, and counters",
      "Damaged baseboard, casing, and quarter round",
      "Shelving, mirrors, TVs, and wall anchors",
      "Weatherstripping, thresholds, and door sweeps",
    ],
    process: standardProcess("We work the punch list in one visit and confirm each item as it is finished."),
    faqs: [
      {
        question: "Can I combine several small jobs into one visit?",
        answer:
          "Yes — that is the most cost-effective way to use us. Send the full list up front so we bring the right materials and reserve enough time.",
      },
      {
        question: "Do you charge a trip fee?",
        answer: "Estimates are always free, and travel inside our East Texas service area is included in the quoted price.",
      },
      {
        question: "How soon can you come out?",
        answer: "Most general repair lists are scheduled within a few days, and urgent items are often handled same day.",
      },
    ],
    comparison: {
      title: "Repair vs. Replacement",
      optionA: {
        label: "Repair",
        points: [
          "Lower cost, usually same-day",
          "Best when the component is structurally sound",
          "Keeps existing finishes and hardware matched",
        ],
      },
      optionB: {
        label: "Replacement",
        points: [
          "Higher up-front cost, longer lead time",
          "Best when damage is widespread or recurring",
          "Resets the lifespan and improves efficiency",
        ],
      },
      guidance:
        "Our rule of thumb: if the repair costs less than half of replacement and the underlying material is solid, repair it. We tell you honestly which side of that line your project falls on.",
    },
    related: ["carpentry", "drywall-repair", "home-maintenance"],
  },
  {
    slug: "carpentry",
    quoteId: "carpentry",
    icon: Hammer,
    title: "Carpentry",
    short:
      "Custom trim, shelving, framing, and finish carpentry built with precise measurements and clean, lasting joinery.",
    image: carpentryImage,
    featured: true,
    duration: "1-2 Days",
    pricing: { startingFrom: "$250", typicalRange: "$250 – $900" },
    overview: [
      "Carpentry is where craftsmanship shows. Tight miters, level runs, and joints that stay closed through humid East Texas summers are the difference between work that looks built-in and work that looks added on.",
      "We handle finish and light structural carpentry for homes, rentals, and small commercial spaces — trim packages, built-ins, shelving, framing repairs, and rot replacement.",
    ],
    benefits: [
      { title: "Precision", copy: "Measured twice and scribed to the wall so gaps do not show after paint." },
      { title: "Durability", copy: "Exterior-rated lumber, fasteners, and glue selected for the location." },
      { title: "Value", copy: "Custom storage and trim detail raise the perceived quality of the whole room." },
    ],
    commonRepairs: [
      "Baseboard, crown, and door casing installation",
      "Built-in shelving, closets, and mudroom benches",
      "Rotted fascia, soffit, and trim board replacement",
      "Stair tread, riser, and railing repair",
      "Interior wall framing and blocking",
      "Cabinet and countertop support repairs",
    ],
    process: standardProcess("We cut, fit, fasten, and fill on site, then sand ready for finish."),
    faqs: [
      {
        question: "Do you paint or stain the carpentry you install?",
        answer: "Yes. Painting can be bundled into the same project so the trim is finished before we leave.",
      },
      {
        question: "Can you match existing trim profiles?",
        answer:
          "In most cases we can source a matching profile locally. If a profile is discontinued we build a close match from stock stock components.",
      },
      {
        question: "Do you handle structural framing?",
        answer:
          "We handle light framing and repairs. Load-bearing alterations are referred to a licensed structural contractor.",
      },
    ],
    related: ["general-home-repairs", "deck-repair", "flooring-repairs"],
  },
  {
    slug: "drywall-repair",
    quoteId: "drywall",
    icon: Wallpaper,
    title: "Drywall Repair",
    short:
      "Holes, cracks, water damage, and texture matching patched and sanded so the wall looks like nothing ever happened.",
    image: drywallImage,
    featured: true,
    duration: "1-2 Days",
    pricing: { startingFrom: "$175", typicalRange: "$175 – $650" },
    overview: [
      "A drywall patch is only successful when you cannot find it. That takes proper backing, feathered compound over a wide area, and texture matched to the surrounding wall before paint.",
      "We repair everything from doorknob holes to full sheets damaged by leaks, including ceiling repairs and popcorn or knockdown texture matching.",
    ],
    benefits: [
      { title: "Invisible finish", copy: "Texture matched and feathered so the repair disappears under paint." },
      { title: "Dust control", copy: "Contained work areas, plastic sheeting, and vacuum sanding protect your rooms." },
      { title: "Moisture aware", copy: "We identify the source of water damage before closing the wall back up." },
    ],
    commonRepairs: [
      "Nail pops, hairline cracks, and settling seams",
      "Doorknob, furniture, and accident holes",
      "Water-damaged ceilings and walls",
      "Corner bead damage and dents",
      "Texture matching — orange peel, knockdown, popcorn",
      "Full sheet replacement after plumbing repairs",
    ],
    process: standardProcess("We back, patch, coat, sand, texture, and prime the repair for paint."),
    faqs: [
      {
        question: "How long before the patch can be painted?",
        answer:
          "Small patches are usually paintable the same day. Larger repairs need a second coat and dry overnight before finishing.",
      },
      {
        question: "Do you paint the repaired area?",
        answer: "Yes — we can prime and paint the patch or the full wall so the sheen matches evenly.",
      },
      {
        question: "Will there be dust everywhere?",
        answer: "No. We mask adjacent areas and sand with dust control so cleanup is minimal.",
      },
    ],
    related: ["interior-painting", "general-home-repairs", "carpentry"],
  },
  {
    slug: "interior-painting",
    quoteId: "interior-painting",
    icon: PaintRoller,
    title: "Interior Painting",
    short:
      "Properly prepped walls, crisp cut lines, and even coverage that refreshes a room without the mess or the guesswork.",
    image: paintingImage,
    featured: true,
    duration: "1-2 Days",
    pricing: { startingFrom: "$300", typicalRange: "$300 – $950" },
    overview: [
      "Ninety percent of a good paint job happens before the first coat: patching, caulking, sanding, masking, and protecting floors and furniture.",
      "We paint single rooms, whole interiors, ceilings, trim, doors, and cabinets using quality coatings that hold their color and clean up without burnishing.",
    ],
    benefits: [
      { title: "Quality", copy: "Premium coatings applied at proper spread rate for true, even coverage." },
      { title: "Clean work", copy: "Floors and furniture covered, hardware removed, lines cut by hand." },
      { title: "Long-term value", copy: "Correct primer and sheen selection means the finish lasts years, not seasons." },
    ],
    commonRepairs: [
      "Full room and whole-interior repaints",
      "Ceiling painting and stain blocking",
      "Trim, doors, and cabinet finishing",
      "Accent walls and color changes",
      "Rental turnover and make-ready painting",
      "Patch, caulk, and prep before coating",
    ],
    process: standardProcess("We prep, prime, cut, and roll two coats, then reinstall hardware."),
    faqs: [
      {
        question: "Do you supply the paint?",
        answer: "We can supply it or apply paint you have already purchased — your estimate makes the difference clear.",
      },
      {
        question: "How long does a room take?",
        answer: "A standard bedroom is typically one day including prep. Whole interiors run several days.",
      },
      {
        question: "Do I need to move furniture?",
        answer: "Move small items if you can; we move and cover the larger pieces as part of the job.",
      },
    ],
    comparison: {
      title: "Interior vs. Exterior Painting",
      optionA: {
        label: "Interior Painting",
        points: [
          "Low-VOC coatings, washable finishes",
          "Weather independent — any season",
          "Prep focuses on patching and masking",
        ],
      },
      optionB: {
        label: "Exterior Painting",
        points: [
          "UV and moisture resistant coatings",
          "Needs dry, mild weather windows",
          "Prep focuses on washing, scraping, and sealing",
        ],
      },
      guidance:
        "Interior work can be scheduled any time of year. Exterior projects are best booked for spring or fall in East Texas, when humidity and surface temperatures let the coating cure properly.",
    },
    related: ["exterior-painting", "drywall-repair", "general-home-repairs"],
  },
  {
    slug: "exterior-painting",
    quoteId: "exterior-painting",
    icon: Brush,
    title: "Exterior Painting",
    short:
      "Siding, trim, fascia, and doors coated with weather-ready finishes that stand up to the East Texas sun and humidity.",
    image: exteriorPaintingImage,
    featured: true,
    duration: "3-5 Days",
    pricing: { startingFrom: "$650", typicalRange: "$650 – $2,400" },
    overview: [
      "Exterior paint is your home's first line of defense. When it fails, moisture reaches the substrate and repairs get expensive fast.",
      "We wash, scrape, sand, prime bare wood, replace rotted boards, seal every gap, and finish with coatings rated for full sun and heavy humidity.",
    ],
    benefits: [
      { title: "Protection", copy: "Sealed joints and primed bare wood keep moisture out of the structure." },
      { title: "Durability", copy: "UV-stable, mildew-resistant coatings selected for the local climate." },
      { title: "Curb appeal", copy: "A crisp exterior is the single biggest visual upgrade to a property." },
    ],
    commonRepairs: [
      "Full exterior siding repaints",
      "Trim, fascia, and soffit coating",
      "Front door and shutter refinishing",
      "Rotted board replacement before paint",
      "Deck and fence staining or sealing",
      "Peeling and chalking surface restoration",
    ],
    process: standardProcess("We wash, prep, prime, and apply finish coats section by section."),
    faqs: [
      {
        question: "What time of year is best?",
        answer: "Spring and fall give the most reliable cure conditions in East Texas, though we paint year-round when weather allows.",
      },
      {
        question: "Is pressure washing included?",
        answer: "Yes — a proper wash is part of every exterior paint estimate.",
      },
      {
        question: "Do you replace rotted wood?",
        answer: "We do. Any rot found during prep is quoted separately and repaired before coating.",
      },
    ],
    related: ["pressure-washing", "interior-painting", "deck-repair"],
  },
  {
    slug: "door-installation-repair",
    quoteId: "door-install",
    icon: DoorOpen,
    title: "Door Installation & Repair",
    short:
      "Interior, exterior, storm, and patio doors hung level, sealed tight, and adjusted to swing and latch perfectly.",
    image: doorsImage,
    featured: true,
    duration: "Same Day",
    pricing: { startingFrom: "$120", typicalRange: "$120 – $750" },
    overview: [
      "A door that drags, sticks, or refuses to latch is usually a framing or hinge geometry problem, not a door problem. We diagnose the real cause instead of shaving the slab.",
      "We install new pre-hung and slab doors, rebuild damaged jambs, replace weatherstripping, and adjust hardware so every door closes softly and locks securely.",
    ],
    benefits: [
      { title: "Security", copy: "Reinforced strike plates and properly shimmed jambs make forced entry harder." },
      { title: "Efficiency", copy: "Tight weatherstripping and thresholds cut drafts and cooling costs." },
      { title: "Professional workmanship", copy: "Level, plumb, and square installs that stay adjusted." },
    ],
    commonRepairs: [
      "Pre-hung exterior and interior door installation",
      "Sticking, dragging, or sagging doors",
      "Damaged jambs, thresholds, and strike plates",
      "Storm, screen, and patio door repair",
      "Lockset, deadbolt, and smart lock installation",
      "Weatherstripping and door sweep replacement",
    ],
    process: standardProcess("We set the unit plumb and square, shim, fasten, seal, and adjust the hardware."),
    faqs: [
      {
        question: "Can you install a door I already bought?",
        answer: "Absolutely. Bring the unit and we handle removal, install, and finish work.",
      },
      {
        question: "Can a damaged door be repaired instead of replaced?",
        answer: "Often yes — hinge, jamb, and strike repairs solve most problems at a fraction of replacement cost.",
      },
      {
        question: "Do you haul away the old door?",
        answer: "Yes, disposal of the old unit is included on request.",
      },
    ],
    related: ["window-repair", "carpentry", "general-home-repairs"],
  },
  {
    slug: "window-repair",
    quoteId: "window-repair",
    icon: Blinds,
    title: "Window Repair",
    short:
      "Broken sashes, worn seals, stubborn hardware, and rotted sills repaired to restore comfort and cut drafts.",
    image: windowsImage,
    duration: "Same Day",
    pricing: { startingFrom: "$150", typicalRange: "$150 – $500" },
    overview: [
      "Drafty, stuck, or leaking windows waste energy and let moisture into the wall. Most of those issues are repairable without replacing the whole unit.",
      "We repair sashes, balances, locks, screens, glazing, and sills, and re-seal the exterior perimeter to stop water intrusion.",
    ],
    benefits: [
      { title: "Comfort", copy: "Drafts and hot spots eliminated with proper sealing and hardware." },
      { title: "Safety", copy: "Windows that open and latch correctly are essential egress in an emergency." },
      { title: "Value", copy: "Targeted repairs cost far less than full window replacement." },
    ],
    commonRepairs: [
      "Sash balance and crank hardware replacement",
      "Window locks and latches",
      "Screen repair and re-screening",
      "Rotted sill and apron repair",
      "Failed exterior caulk and flashing",
      "Sticking or painted-shut sashes",
    ],
    process: standardProcess("We repair or replace the failed component and re-seal the opening."),
    faqs: [
      {
        question: "Do you replace broken glass?",
        answer: "We coordinate glass and insulated unit replacement and handle all the surrounding repair work.",
      },
      {
        question: "Can you fix foggy double-pane windows?",
        answer: "Fogging means the seal has failed; the insulated glass unit is replaced while keeping the existing frame.",
      },
      {
        question: "Will repair really stop my drafts?",
        answer: "In most homes, yes — weatherstripping and perimeter sealing solve the majority of draft complaints.",
      },
    ],
    related: ["door-installation-repair", "home-maintenance", "general-home-repairs"],
  },
  {
    slug: "flooring-repairs",
    quoteId: "flooring",
    icon: Layers,
    title: "Flooring Repairs",
    short:
      "Loose planks, damaged laminate, squeaky subfloor, and worn transitions repaired for a level, quiet finish.",
    image: flooringImage,
    duration: "1-2 Days",
    pricing: { startingFrom: "$200", typicalRange: "$200 – $850" },
    overview: [
      "Floors take the most abuse in the house. A single damaged plank, a soft spot, or a lifting transition strip makes an otherwise good floor feel worn out.",
      "We repair and replace sections of laminate, LVP, engineered wood, and tile, re-secure squeaky subfloor, and install clean transitions between rooms.",
    ],
    benefits: [
      { title: "Safety", copy: "Level surfaces and secured transitions remove trip hazards." },
      { title: "Durability", copy: "Correct underlayment and expansion gaps prevent the damage from returning." },
      { title: "Cost saving", copy: "Section repairs avoid the cost of replacing an entire floor." },
    ],
    commonRepairs: [
      "Damaged laminate and LVP plank replacement",
      "Squeaky and soft subfloor repair",
      "Transition strip and threshold installation",
      "Loose or cracked tile replacement",
      "Water-damaged flooring sections",
      "Baseboard and quarter round re-installation",
    ],
    process: standardProcess("We remove the damaged section, correct the subfloor, and install matching material."),
    faqs: [
      {
        question: "Can you match my existing flooring?",
        answer: "We match where product is still available; otherwise we source the closest available profile and color.",
      },
      {
        question: "What causes squeaky floors?",
        answer: "Usually subfloor movement against joists or fasteners. We re-secure the subfloor to stop it.",
      },
      {
        question: "Do you install whole new floors?",
        answer: "We take on small to mid-size installations; large whole-home installs are referred to a flooring specialist.",
      },
    ],
    related: ["carpentry", "general-home-repairs", "property-improvements"],
  },
  {
    slug: "fence-repair",
    quoteId: "fence-repair",
    icon: Fence,
    title: "Fence Repair",
    short:
      "Leaning posts, broken pickets, sagging gates, and storm damage rebuilt so your fence line stands straight again.",
    image: fenceImage,
    duration: "1-2 Days",
    pricing: { startingFrom: "$225", typicalRange: "$225 – $1,200" },
    overview: [
      "East Texas storms and clay soil are hard on fences. Posts shift, rails pull loose, and gates drop out of square.",
      "We reset and replace posts in concrete, replace rails and pickets, rebuild gates with proper bracing, and stain or seal the finished run.",
    ],
    benefits: [
      { title: "Security & privacy", copy: "A straight, solid fence keeps pets in and eyes out." },
      { title: "Durability", copy: "Treated posts set in concrete with correct depth for local soil." },
      { title: "Value", copy: "Repairing sound sections costs far less than a full fence replacement." },
    ],
    commonRepairs: [
      "Leaning or rotted post replacement",
      "Broken picket and rail replacement",
      "Sagging gate rebuild and hardware",
      "Storm and fallen-limb damage",
      "Fence staining and sealing",
      "Section replacement and line straightening",
    ],
    process: standardProcess("We reset posts, rebuild the damaged run, and re-hang gates square."),
    faqs: [
      {
        question: "Can you repair just one section?",
        answer: "Yes — section repairs are common and we blend new material into the existing fence line.",
      },
      {
        question: "How long before I can stain new boards?",
        answer: "New treated lumber should dry out for several weeks before stain is applied.",
      },
      {
        question: "Do you build new fences?",
        answer: "We build short runs and gates; full perimeter fencing is quoted case by case.",
      },
    ],
    comparison: {
      title: "Wood Fence vs. Vinyl Fence",
      optionA: {
        label: "Wood Fence",
        points: [
          "Lower up-front cost, easy to repair board by board",
          "Natural look, can be stained any color",
          "Needs sealing every 2-3 years",
        ],
      },
      optionB: {
        label: "Vinyl Fence",
        points: [
          "Higher up-front cost, very low maintenance",
          "No staining, rot, or insect damage",
          "Panels must be replaced as whole sections",
        ],
      },
      guidance:
        "Wood is the practical choice for most East Texas properties — cheaper to install and repairable in place. Vinyl pays off if you want to stop maintaining the fence entirely and plan to stay long term.",
    },
    related: ["deck-repair", "pressure-washing", "exterior-painting"],
  },
  {
    slug: "deck-repair",
    quoteId: "deck-repair",
    icon: Trees,
    title: "Deck Repair",
    short:
      "Rotted boards replaced, railings re-secured, and surfaces sanded and sealed for a safe, inviting outdoor space.",
    image: deckImage,
    featured: true,
    duration: "1-2 Days",
    pricing: { startingFrom: "$275", typicalRange: "$275 – $1,500" },
    overview: [
      "Decks fail from the fasteners out. Loose railings and soft boards are safety issues long before the deck looks bad.",
      "We inspect the framing and ledger, replace damaged decking and joists, re-secure railings and stairs, then sand and seal for a finish that sheds water.",
    ],
    benefits: [
      { title: "Safety", copy: "Railings, stairs, and ledger connections brought back to solid, code-minded condition." },
      { title: "Durability", copy: "Treated lumber, hidden fasteners, and sealed end grain resist rot." },
      { title: "Long-term value", copy: "Annual sealing extends deck life by many years for a fraction of rebuild cost." },
    ],
    commonRepairs: [
      "Rotted or splintered deck board replacement",
      "Loose or wobbly railing repair",
      "Stair tread and stringer repair",
      "Joist and ledger inspection and reinforcement",
      "Sanding, staining, and sealing",
      "Popped nail and fastener replacement",
    ],
    process: standardProcess("We replace failed members, re-fasten the structure, then sand and seal."),
    faqs: [
      {
        question: "How do I know if my deck is unsafe?",
        answer: "Bouncing boards, wobbly rails, and soft spots near the house are warning signs — we inspect for free.",
      },
      {
        question: "How often should a deck be sealed?",
        answer: "Every one to two years in East Texas sun and humidity keeps water out of the grain.",
      },
      {
        question: "Repair or rebuild?",
        answer:
          "If the framing is sound, board replacement is the better value. Widespread framing rot usually means a rebuild.",
      },
    ],
    related: ["fence-repair", "pressure-washing", "carpentry"],
  },
  {
    slug: "pressure-washing",
    quoteId: "pressure-washing",
    icon: Droplets,
    title: "Pressure Washing",
    short:
      "Driveways, walkways, siding, patios, and fences washed back to clean without damaging the surface underneath.",
    image: washImage,
    featured: true,
    duration: "Same Day",
    pricing: { startingFrom: "$150", typicalRange: "$150 – $600" },
    overview: [
      "Pressure is only half the job. The right nozzle, distance, and detergent are what remove mildew and oxidation without etching concrete or driving water behind siding.",
      "We soft-wash siding and painted surfaces and use surface cleaners on flatwork for an even, streak-free result.",
    ],
    benefits: [
      { title: "Curb appeal", copy: "Immediate, dramatic improvement to driveways, walkways, and siding." },
      { title: "Safety", copy: "Removes slick algae and mildew from walkways and patios." },
      { title: "Protection", copy: "Cleaning before painting or sealing dramatically improves adhesion." },
    ],
    commonRepairs: [
      "Driveway, sidewalk, and patio cleaning",
      "House siding soft washing",
      "Fence and deck cleaning before staining",
      "Gutter face and soffit cleaning",
      "Oil and rust stain treatment",
      "Prep washing before exterior painting",
    ],
    process: standardProcess("We pre-treat, wash in sections, and rinse plants and surfaces clean."),
    faqs: [
      {
        question: "Will pressure washing damage my siding?",
        answer: "Not with soft washing. We match pressure and detergent to the surface every time.",
      },
      {
        question: "Do you need to use my water?",
        answer: "Yes, we connect to an exterior spigot — everything else comes with us.",
      },
      {
        question: "How long does a driveway take?",
        answer: "Most residential driveways are finished within a few hours.",
      },
    ],
    related: ["exterior-painting", "deck-repair", "home-maintenance"],
  },
  {
    slug: "home-maintenance",
    quoteId: "maintenance",
    icon: Sparkles,
    title: "Home Maintenance",
    short:
      "Scheduled seasonal upkeep — caulking, weatherstripping, gutters, and inspections that prevent expensive surprises.",
    image: maintenanceImage,
    duration: "Same Day",
    pricing: { startingFrom: "$175", typicalRange: "$175 – $550" },
    overview: [
      "Maintenance is the cheapest repair you will ever pay for. A seasonal visit catches the failing caulk bead, the clogged gutter, and the loose deck rail before they turn into damage.",
      "We offer spring and fall maintenance visits with a documented checklist and photos of anything that needs attention.",
    ],
    benefits: [
      { title: "Prevention", copy: "Small issues found and corrected before they cause water or structural damage." },
      { title: "Documentation", copy: "A written checklist and photos after each visit for your records." },
      { title: "Long-term value", copy: "Consistent upkeep protects resale value and lowers lifetime repair cost." },
    ],
    commonRepairs: [
      "Gutter cleaning and downspout checks",
      "Exterior caulking and weatherstripping",
      "Door, window, and hardware adjustment",
      "Smoke detector and vent checks",
      "Deck, fence, and railing inspection",
      "Seasonal punch-list repairs",
    ],
    process: standardProcess("We work the seasonal checklist and document findings with photos."),
    faqs: [
      {
        question: "How often should maintenance happen?",
        answer: "Twice a year — spring and fall — covers the majority of seasonal issues in East Texas.",
      },
      {
        question: "Can you maintain a rental property remotely?",
        answer: "Yes. Many landlords use us for scheduled visits with photo reports after each service.",
      },
      {
        question: "Are repairs included?",
        answer: "Minor adjustments are included; larger repairs found during the visit are quoted before any work starts.",
      },
    ],
    related: ["property-improvements", "general-home-repairs", "pressure-washing"],
  },
  {
    slug: "property-improvements",
    quoteId: "property-improvements",
    icon: Wrench,
    title: "Property Improvements & Make-Ready",
    short:
      "Turnovers, small upgrades, and make-ready work for landlords, agents, and small businesses on a firm timeline.",
    image: improvementsImage,
    duration: "3-5 Days",
    pricing: { startingFrom: "$450", typicalRange: "$450 – $2,500" },
    overview: [
      "Vacancy costs money every day. Make-ready work has to be fast, complete, and finished to a standard that shows well in listing photos.",
      "We coordinate paint, drywall, flooring, doors, fixtures, and cleaning into a single scheduled turnover with one point of contact and one invoice.",
    ],
    benefits: [
      { title: "Speed", copy: "Trades sequenced so the unit is listing-ready in the fewest possible days." },
      { title: "Single contact", copy: "One crew, one schedule, one invoice instead of chasing multiple contractors." },
      { title: "Presentation", copy: "Finished to photograph well and pass move-in inspections." },
    ],
    commonRepairs: [
      "Full rental turnovers and make-ready",
      "Punch lists before closing or inspection",
      "Fixture, hardware, and lighting upgrades",
      "Small commercial and office repairs",
      "Wall repair and full repaints",
      "Curb appeal and exterior cleanup",
    ],
    process: standardProcess("We sequence each trade and update you as the turnover progresses."),
    faqs: [
      {
        question: "Can you work while the property is vacant?",
        answer: "Yes — lockbox and remote coordination are standard for our property manager clients.",
      },
      {
        question: "Do you provide before and after photos?",
        answer: "Always, so owners and agents can verify completion remotely.",
      },
      {
        question: "Do you handle multiple units?",
        answer: "We regularly schedule multi-unit turnovers on rolling timelines.",
      },
    ],
    related: ["interior-painting", "home-maintenance", "flooring-repairs"],
  },
  {
    slug: "fixtures-and-assembly",
    quoteId: "electrical",
    icon: Lightbulb,
    title: "Fixtures, Assembly & Minor Plumbing",
    short:
      "Ceiling fans, light fixtures, faucets, disposals, and flat-pack furniture installed correctly and safely anchored.",
    image: fixturesImage,
    duration: "Same Day",
    pricing: { startingFrom: "$90", typicalRange: "$90 – $450" },
    overview: [
      "The small installs — a ceiling fan, a vanity light, a new faucet, a wall of shelving — are quick for us and frustrating to do alone with the wrong tools.",
      "We handle light fixture swaps, minor plumbing repairs, and furniture and shelving assembly, anchored properly into studs or rated hardware.",
    ],
    benefits: [
      { title: "Safety", copy: "Fixtures mounted to rated boxes and anchors, connections checked before we leave." },
      { title: "Speed", copy: "Most fixture and assembly jobs are completed in a single visit." },
      { title: "Professional workmanship", copy: "Level, centered, and finished without damage to walls or ceilings." },
    ],
    commonRepairs: [
      "Ceiling fan and light fixture replacement",
      "Vanity lights, chandeliers, and outdoor fixtures",
      "Dripping faucets and running toilets",
      "Garbage disposal and supply line replacement",
      "Flat-pack furniture and shelving assembly",
      "TV mounting and wall anchoring",
    ],
    process: standardProcess("We install, secure, test, and clean up the work area the same visit."),
    faqs: [
      {
        question: "Is there electrical work you won't do?",
        answer:
          "We handle fixture-level replacement. New circuits, panel work, and rewiring are referred to a licensed electrician.",
      },
      {
        question: "What about larger plumbing jobs?",
        answer: "Minor repairs and replacements only — repiping and sewer work go to a licensed plumber.",
      },
      {
        question: "Can you assemble furniture I bought online?",
        answer: "Yes, including anchoring tall pieces to the wall for safety.",
      },
    ],
    related: ["general-home-repairs", "home-maintenance", "door-installation-repair"],
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const assemblyIcon = Armchair;
