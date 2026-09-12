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
  nadwaLogo: "/assets/brand/nadwa-logo.png",
  nadwaLogoLg: "/assets/brand/nadwa-logo-lg.png",
  lateefLogoGreen: "/assets/brand/lateeful akbar logo Green.png",
  lateefLogoAsh: "/assets/brand/lateeful akbar logo ASH.png",
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

const RAW_GATHERING: GalleryItem[] = [
  { src: "/assets/gallery/gathering/crowd-08.jpg", label: "The sisters' canopy - thousands in white", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-49.jpg", label: "The stands fill at TBS", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-67.jpg", label: "A sea that stretches on", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-80.jpg", label: "Arrival tide at the gates", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-52.jpg", label: "Brothers gathered in prayer", category: "Gathering" },
  { src: "/assets/gallery/gathering/crowd-63.jpg", label: "Congregation filled to capacity", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-5.jpg", label: "Grand congregation at Tafawa Balewa Square", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-51.jpg", label: "Mass assembly at Tafawa Balewa Square", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-88.jpg", label: "Overview of grand seating area", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-297.jpg", label: "Worshippers occupying main bowl", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-310.jpg", label: "Crowd in white attire", category: "Gathering" },
  { src: "/assets/gallery/gathering/LATEEFULAKBAR-412.jpg", label: "Mass congregation in Tasbīh", category: "Gathering" },
];

const RAW_PEOPLE: GalleryItem[] = [
  { src: "/assets/gallery/people/crowd-15.jpg", label: "The convener at dhikr", category: "People" },
  { src: "/assets/gallery/people/crowd-30.jpg", label: "Brothers in quiet reflection", category: "People" },
  { src: "/assets/gallery/people/crowd-52.jpg", label: "The brothers' section", category: "People" },
  { src: "/assets/gallery/people/crowd-63.jpg", label: "Scholars on stage", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-62.jpg", label: "Attendees in solemn contemplation", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-77.jpg", label: "Brothers listening attentively", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-115.jpg", label: "Distinguished guests & elders", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-150.jpg", label: "Youth & attendees engaged in prayer", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-170.jpg", label: "Faces of faith and hope", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-229.jpg", label: "Islamic scholars & dignitaries", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-248.jpg", label: "Worshippers sharing warmth", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-249.jpg", label: "Devotion during recitation", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-257.jpg", label: "Moments of earnest supplication", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-261.jpg", label: "Brothers standing shoulder to shoulder", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-262.jpg", label: "Community members at the venue", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-266.jpg", label: "Peaceful smiles among attendees", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-274.jpg", label: "Worshippers in peaceful assembly", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-279.jpg", label: "Scholars and congregants united", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-323.jpg", label: "Expressions of deep devotion", category: "People" },
  { src: "/assets/gallery/people/LATEEFULAKBAR-354.jpg", label: "Gathered for remembrance and prayer", category: "People" },
];

const RAW_ATMOSPHERE: GalleryItem[] = [
  { src: "/assets/gallery/atmosphere/crowd-18.jpg", label: "Hands raised in du'a", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-48.jpg", label: "Midday recitation at TBS", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-54.jpg", label: "Stillness before the call", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-58.jpg", label: "Evening light on white", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-15.jpg", label: "Atmosphere of devotion", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-31.jpg", label: "Rows in deep supplication", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/crowd-75.jpg", label: "Closing prayer moments", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-21.jpg", label: "Sacred moments at Lateeful Akbar", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-41.jpg", label: "Spiritual ambience across TBS", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-48.jpg", label: "Spiritual ambience in the Square", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-74.jpg", label: "Morning light on white canopies", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-76.jpg", label: "Moments of shared prayer", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-79.jpg", label: "Deep devotion in the congregation", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-83.jpg", label: "Praise and remembrance", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-86.jpg", label: "Worshippers gathered in harmony", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-92.jpg", label: "Serenity amidst the congregation", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-96.jpg", label: "Echoes of praise and Tasbīh", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-103.jpg", label: "Blessed moments of dhikr", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-112.jpg", label: "Echoes of Yaa Lateef", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-190.jpg", label: "Peaceful reflection", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-237.jpg", label: "Light across the arena", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-255.jpg", label: "Congregation in unison", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-286.jpg", label: "Spirit of unity and faith", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-289.jpg", label: "Gathered under His mercy", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-395.jpg", label: "Solemn prayer at sunset", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-471.jpg", label: "A sea of white worshippers", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-472.jpg", label: "Devotion in the main bowl", category: "Atmosphere" },
  { src: "/assets/gallery/atmosphere/LATEEFULAKBAR-473.jpg", label: "Voices united in Tasbīh", category: "Atmosphere" },
];

const RAW_DRONE: GalleryItem[] = [
  { src: "/assets/gallery/drone/crowd-12.jpg", label: "Aerial panorama of Tafawa Balewa Square", category: "Drone" },
  { src: "/assets/gallery/drone/LATEEFULAKBAR-6.jpg", label: "Bird's-eye view of the white sea", category: "Drone" },
  { src: "/assets/gallery/drone/LATEEFULAKBAR-7.jpg", label: "Overhead vista of the grand canopy", category: "Drone" },
  { src: "/assets/gallery/drone/lateefulakbar-poster.jpg", label: "Aerial view of Lateeful Akbar venue", category: "Drone" },
];

function interleaveGallery(): GalleryItem[] {
  const buckets = [RAW_GATHERING, RAW_PEOPLE, RAW_ATMOSPHERE, RAW_DRONE];
  const result: GalleryItem[] = [];
  const maxLen = Math.max(...buckets.map((b) => b.length));
  for (let i = 0; i < maxLen; i++) {
    for (const b of buckets) {
      if (i < b.length) {
        result.push(b[i]);
      }
    }
  }
  return result;
}

export const GALLERY: GalleryItem[] = interleaveGallery();

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
