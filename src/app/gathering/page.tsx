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
        eyebrow="Gathering"
        title={<>Not a programme. A single act of worship, by a city.</>}
        arabic="يَا لَطِيفُ"
        intro="Lateeful-Ul-Akbar Li-A’azam is Nadwat Global Assembly's grand sitting of dhikr — one morning, one square, tens of thousands in white under the Name Yā Lateef. This page explains the gathering in full."
        image="/assets/crowd-67.jpg"
      />
      <Story />
    </>
  );
}
