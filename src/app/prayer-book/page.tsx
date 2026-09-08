import PageHeader from "@/components/PageHeader";
import PrayerBookViewer from "@/components/PrayerBookViewer";

export const metadata = {
  title: "Prayer Book — Read the Supplications",
  description: "The official Nadwat prayer book, set for the screen: Arabic, transliteration and translation on every page.",
};

export default function PrayerBookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prayer Book"
        title={<>Read the supplications here</>}
        arabic="بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
        intro="The official Nadwat prayer book, set for the screen. Arabic, transliteration and translation on every page — reading stays inside the site so the text keeps its accuracy."
        image="/assets/crowd-54.jpg"
      />
      <PrayerBookViewer />
    </>
  );
}
