import PageHeader from "@/components/PageHeader";
import RegistrationPortal from "@/components/RegistrationPortal";

export const metadata = {
  title: "Register — Reserve Your Place (Free)",
  description: "Free registration for Lateeful-Ul-Akbar 2027: three short steps and your printable pass artwork with referral code.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Registration"
        title={<>Your pass, in three short steps</>}
        intro="Free for every guest — physical at TBS or online via livestream. Tell us who you are, how you will join, and add a photo for your printable accreditation artwork."
        image="/assets/crowd-12.jpg"
      />
      <RegistrationPortal />
    </>
  );
}
