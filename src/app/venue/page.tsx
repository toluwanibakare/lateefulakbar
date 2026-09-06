import PageHeader from "@/components/PageHeader";
import VenueMapAndRules from "@/components/VenueMapAndRules";

export const metadata = {
  title: "Venue — Tafawa Balewa Square",
  description: "Gates, canopies, parking, medical and house rules for the Square — plus route planning from your location.",
};

export default function VenuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Venue"
        title={<>Tafawa Balewa Square, learned by heart</>}
        intro="Gates, canopies, parking and help points at the Main Bowl, Lagos Island. Study the Square before the morning — then plan your route."
        image="/assets/drone-wide.png"
      />
      <VenueMapAndRules />
    </>
  );
}
