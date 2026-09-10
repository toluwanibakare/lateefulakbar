export const EVENT = {
  title: "Lateef ul-il-Akbar-Il-A’azam",
  suffix: "Li-A’azam 2027",
  dateLong: "Sunday, January 24, 2027",
  dateShort: "24 . 01 . 2027",
  venue: "Tafawa Balewa Square - Main Bowl, Lagos",
  targetISO: "2027-01-24T08:00:00+01:00",
  dressCode: "Strictly all white",
  email: "info@lateefulakbar.com",
};

/* Every piece of provided media, blended across the site.
   15 crowd frames + founder portrait + poster + banner + drone + film */
export const FILM = "/assets/lateef-highlight-video.mp4";

export const PHOTOS = {
  founderPortrait: "/assets/founder-portrait.jpg",
  founderAlt: "/assets/founder.jpeg",
  poster: "/assets/lateefulakbar-poster.jpg",
  banner: "/assets/event-banner.png",
  screenshot: "/assets/event-screenshot.png",
  nadwaLogo: "/assets/nadwa-logo.png",
  nadwaLogoLg: "/assets/nadwa-logo-lg.png",
  drone: "/assets/crowd-11.jpg",
  cannonCrowd: "/assets/crowd-08.jpg",
  sisters: "/assets/crowd-08.jpg",
  brothers: "/assets/crowd-52.jpg",
  stands: "/assets/crowd-49.jpg",
  portraits: "/assets/crowd-30.jpg",
};

export type GalleryItem = {
  src: string;
  label: string;
  category: "Gathering" | "People" | "Atmosphere" | "Drone";
  span?: string;
};

/* All gallery items categorized in their respective subfolders */
export const GALLERY: GalleryItem[] = [
  // Gathering
  { src: "/assets/gallery/gathering/crowd-08.jpg", label: "The sisters' canopy - thousands in white", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-31.jpg", label: "Row upon row of white", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-49.jpg", label: "The stands fill at TBS", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-67.jpg", label: "A sea that stretches on", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-75.jpg", label: "Closing supplication", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-80.jpg", label: "Arrival tide at the gates", category: "Gathering" },

  // People
  { src: "/assets/gallery/people/crowd-15.jpg", label: "The convener at dhikr", category: "People" },
  { src: "/assets/gallery/people/crowd-30.jpg", label: "Brothers in quiet reflection", category: "People" },
  { src: "/assets/gallery/people/crowd-52.jpg", label: "The brothers' hall", category: "People" },
  { src: "/assets/gallery/people/crowd-63.jpg", label: "Scholars on stage", category: "People" },

  // Atmosphere
  { src: "/assets/gallery/atmosphere/crowd-18.jpg", label: "Hands raised in du'a", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-48.jpg", label: "Midday recitation", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-54.jpg", label: "Stillness before the call", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-58.jpg", label: "Evening light on white", category: "Atmosphere" },

  // Drone
  { src: "/assets/gallery/drone/crowd-11.jpg", label: "Drone over Tafawa Balewa Square", category: "Drone" },
];

export const HERO_SEQUENCE = [
  "/assets/crowd-12.jpg",
  "/assets/crowd-11.jpg",
  "/assets/event-screenshot.png",
];

export const BLOG_POSTS = [
  {
    slug: "sea-of-white",
    category: "Field Notes",
    title: "What a sea of white does to a city",
    excerpt:
      "TBS holds noise well. On the day, it held silence better - 40,000 people breathing the same dhikr.",
    image: "/assets/crowd-67.jpg",
    date: "Jan 2027",
    read: "6 min",
  },
  {
    slug: "ya-lateef",
    category: "Meaning",
    title: "Yaa Lateef: the Name we gather under",
    excerpt:
      "Subtlety, kindness, the grace that arrives before you ask. A short reading for first-time guests.",
    image: "/assets/crowd-18.jpg",
    date: "Dec 2026",
    read: "4 min",
  },
  {
    slug: "tbs-logistics",
    category: "Guide",
    title: "Coming to the Square: gates, seating, water",
    excerpt:
      "Where the brothers sit, where the sisters sit, where the water and fans are - a plain-language walkthrough.",
    image: "/assets/crowd-11.jpg",
    date: "Dec 2026",
    read: "8 min",
  },
];

export const PRAYER_PAGES = [
  {
    page: 1,
    title: "Opening - Bismillah",
    arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "Bismillāhir-Rahmānir-Rahīm",
    translation:
      "In the name of Allah, the Most Gracious, the Most Merciful. We open this gathering with His praise alone.",
  },
  {
    page: 2,
    title: "Yaa Lateef - the gathering dhikr",
    arabic: "يَا لَطِيفُ يَا لَطِيفُ يَا لَطِيفُ",
    transliteration: "Yaa Lateef, Yaa Lateef, Yaa Lateef",
    translation:
      "O Most Kind, O Most Subtle - be gentle with us in all that destiny brings, seen and unseen.",
  },
  {
    page: 3,
    title: "Du‘ā for relief",
    arabic: "اَللَّٰهُمَّ ٱكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ",
    transliteration: "Allāhumma-kfinī bi-halālika ‘an harāmik",
    translation:
      "O Allah, suffice us with what is lawful, and enrich us by Your favour from need of any besides You.",
  },
  {
    page: 4,
    title: "Closing - for the Ummah",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
    transliteration: "Rabbanā ātinā fid-dunyā hasanah",
    translation:
      "Our Lord, grant us good in this world and good in the Hereafter, and shield us from the Fire.",
  },
];
