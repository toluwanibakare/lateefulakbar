import PageHeader from "@/components/PageHeader";
import Blog from "@/components/Blog";

export const metadata = {
  title: "Journal — Notes Toward the Square",
  description: "Short reads on the meaning, the logistics and the memories of Lateeful-Ul-Akbar.",
};

export default function JournalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={<>Notes toward the Square</>}
        intro="Short reads on the meaning, the logistics and the memories — from the Name we gather under to gates, seating and water. New entries until the gates open."
        image="/assets/crowd-18.jpg"
      />
      <Blog />
    </>
  );
}
