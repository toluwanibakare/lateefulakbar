import PageHeader from "@/components/PageHeader";
import Gallery from "@/components/Gallery";

export const metadata = {
  title: "Gallery — Previous Sittings",
  description: "Fifteen frames from the Square: gathering, people, atmosphere and drone views from previous Lateeful-Ul-Akbar sittings.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={<>Previous sittings, kept as they were</>}
        intro="No staging, no stock. Fifteen frames from Tafawa Balewa Square — the canopies, the faces, the drone over the Square. Select any image to view it full screen."
        image="/assets/crowd-49.jpg"
      />
      <Gallery />
    </>
  );
}
