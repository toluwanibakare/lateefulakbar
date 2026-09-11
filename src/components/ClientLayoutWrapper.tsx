"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";
import { BackToTop, ScrollProgress } from "@/components/ui";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="min-h-screen overflow-x-hidden max-w-full w-full bg-paper text-ink font-body">
        {children}
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <div className="min-h-screen overflow-x-hidden max-w-full w-full">{children}</div>
      <Footer />
      <AiAssistant />
      <BackToTop />
    </>
  );
}
