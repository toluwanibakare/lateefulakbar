import PageHeader from "@/components/PageHeader";
import Story from "@/components/Story";

export const metadata = {
  title: "The Gathering — Lateeful-Ul-Akbar 2027",
  description: "Why tens of thousands gather in white at TBS Lagos: the meaning, the atmosphere, what to expect and the order of the day.",
};

export default function GatheringPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Gathering"
        title={<>Thousands of hearts. Countless prayer points. One Merciful Lord.</>}
        arabic="يَا لَطِيفُ"
        intro="Lateeful-Ul-Akbar is a grand spiritual gathering centred on Du‘ā, Dhikr, Salawāt and seeking the infinite mercy and subtle kindness of Allah — Al-Lateef."
        image="/assets/crowd-67.jpg"
      />
      <Story />
    </>
  );
}
