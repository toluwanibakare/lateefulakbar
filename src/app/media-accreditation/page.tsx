import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import MediaAccreditationForm from "@/components/MediaAccreditationForm";

export const metadata: Metadata = {
  title: "Media & Blogger Accreditation — Lateeful Akbar 2027",
  description:
    "Apply for official media accreditation, press passes, photographer access, and journalist coverage for Lateeful Akbar 2027 at Tafawa Balewa Square.",
};

export default function MediaAccreditationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Press & Media"
        title={<>Media & Blogger Accreditation</>}
        arabic="الْمَجْلِسُ الْإِعْلَامِي"
        intro="Apply for official press passes, broadcast access, photography tags, and media zone clearance for Lateeful Akbar 2027 at Tafawa Balewa Square."
        image="/assets/crowd-49.jpg"
      />
      <MediaAccreditationForm />
    </>
  );
}
