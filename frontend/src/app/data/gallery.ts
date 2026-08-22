export type GalleryCategory =
  | "All"
  | "Trail Run"
  | "Marathon"
  | "Training"
  | "Community"
  | "Nature"
  | "Awards";

export type GalleryItem = {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  category: Exclude<GalleryCategory, "All">;
  image: string;
  featured?: boolean;
};

/** Premium SVG illustrations for gallery cards */
export const galleryImagePool = [
  "/images/sunrise-finish.svg",
  "/images/mountain-run-hero.svg",
  "/images/first-medal.svg",
  "/images/club-push.svg",
  "/images/weekend-long-run.svg",
  "/images/marathon-pace.svg",
  "/images/trail-summit.svg",
  "/images/nature-run.svg",
] as const;

export const galleryCategories: GalleryCategory[] = [
  "All",
  "Trail Run",
  "Marathon",
  "Training",
  "Community",
  "Nature",
  "Awards",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Ridge line finish",
    event: "Monsoon Mountain Miles",
    location: "Lonavala",
    date: "Jul 2026",
    category: "Trail Run",
    image: "/images/trail-summit.svg",
    featured: true,
  },
  {
    id: "g2",
    title: "First light warmup",
    event: "Himalayan Winter Sprint",
    location: "Manali",
    date: "Dec 2026",
    category: "Training",
    image: "/images/weekend-long-run.svg",
  },
  {
    id: "g3",
    title: "Club pack at km 8",
    event: "Independence Endurance Run",
    location: "Pune",
    date: "Aug 2026",
    category: "Community",
    image: "/images/club-push.svg",
    featured: true,
  },
  {
    id: "g4",
    title: "Medal unboxing night",
    event: "Spring Valley Dash",
    location: "Mumbai",
    date: "Mar 2026",
    category: "Awards",
    image: "/images/first-medal.svg",
    featured: true,
  },
  {
    id: "g5",
    title: "Cloud line long run",
    event: "New Year Night Miles",
    location: "Nilgiris",
    date: "Jan 2026",
    category: "Nature",
    image: "/images/nature-run.svg",
  },
  {
    id: "g6",
    title: "Half marathon split",
    event: "Independence Endurance Run",
    location: "Bengaluru",
    date: "Aug 2026",
    category: "Marathon",
    image: "/images/marathon-pace.svg",
  },
  {
    id: "g7",
    title: "Kids 2 km celebration",
    event: "Holi Color Virtual Run",
    location: "Ahmedabad",
    date: "Mar 2026",
    category: "Community",
    image: "/images/club-push.svg",
  },
  {
    id: "g8",
    title: "Trail dust and pine",
    event: "Monsoon Mountain Miles",
    location: "Mahabaleshwar",
    date: "Jul 2026",
    category: "Trail Run",
    image: "/images/sunrise-finish.svg",
  },
  {
    id: "g9",
    title: "Certificate wall",
    event: "Spring Valley Dash",
    location: "Delhi NCR",
    date: "Mar 2026",
    category: "Awards",
    image: "/images/rewards-showcase.svg",
  },
  {
    id: "g10",
    title: "Sunday long miles",
    event: "Weekend Club Run",
    location: "Hyderabad",
    date: "Jun 2026",
    category: "Training",
    image: "/images/weekend-long-run.svg",
  },
  {
    id: "g11",
    title: "Valley dawn strides",
    event: "Himalayan Winter Sprint",
    location: "Shimla",
    date: "Dec 2026",
    category: "Nature",
    image: "/images/mountain-run-hero.svg",
  },
  {
    id: "g12",
    title: "Finish line cheer",
    event: "Independence Endurance Run",
    location: "Jaipur",
    date: "Aug 2026",
    category: "Marathon",
    image: "/images/marathon-pace.svg",
  },
];

export const galleryStats = [
  { label: "Moments logged", value: 1280 },
  { label: "Events covered", value: 24 },
  { label: "Cities", value: 62 },
  { label: "Verified finishes", value: 5400 },
];
