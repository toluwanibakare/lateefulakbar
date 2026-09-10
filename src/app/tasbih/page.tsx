import PageHeader from "@/components/PageHeader";
import EventDashboard from "@/components/EventDashboard";

export const metadata = {
  title: "Digital Tasbīh Counter — Lateeful Akbar 2027",
  description:
    "Participate in the global Yaa Lateef digital dhikr counter for Lateeful Akbar 2027. Log your recitations in real-time.",
};

export default function TasbihPage() {
  return (
    <>
      <PageHeader
        eyebrow="Global Dhikr"
        title={<>Digital Tasbīh Counter</>}
        arabic="التَّسْبِيح"
        intro="Add your recitations to the worldwide Yaa Lateef total in real-time. Join tens of thousands of believers in invoking Divine Grace."
        image="/assets/praying_mat.jpeg"
      />
      <EventDashboard />
    </>
  );
}
