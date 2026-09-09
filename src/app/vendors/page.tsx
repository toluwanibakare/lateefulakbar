import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VendorRegistrationForm from "@/components/VendorRegistrationForm";

export const metadata: Metadata = {
  title: "Vendor Portal — Lateeful Akbar 2027",
  description:
    "Register as an accredited vendor for Lateeful Akbar 2027 at Tafawa Balewa Square. Apply for food stalls, clothing, books, drinks and services.",
};

export default function VendorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vendor Portal"
        title={<>Vendor Registration & Stalls</>}
        arabic="سُوقُ الْخَيْر"
        intro="Apply for official vendor spaces at Tafawa Balewa Square. Register your business, choose your stall category, review compliance guidelines, and complete online payment for instant approval."
        image="/assets/crowd-12.jpg"
      />
      <VendorRegistrationForm />
    </>
  );
}
