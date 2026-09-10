import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";
import { BackToTop, ScrollProgress } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lateefulakbar.com"),
  title: "Lateeful-Ul-Akbar Li-A’azam 2027 - Nadwat Global Assembly",
  description:
    "A grand gathering of dhikr and du'a at Tafawa Balewa Square, Lagos. 24 January 2027. Register, give sadaqah, read the prayer book and join the global Yaa Lateef tasbīh.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    title: "Lateeful-Ul-Akbar Li-A’azam 2027 - Nadwat Global Assembly",
    description:
      "The Grandeur Gathering Of Sublime Minds. Tens of thousands in white — breathing the same dhikr, seeking with one voice. 24 January 2027 at Tafawa Balewa Square, Lagos.",
    images: [
      {
        url: "/og-image.png",
        width: 1901,
        height: 945,
        alt: "Lateeful-Ul-Akbar Li-A’azam 2027 - Nadwat Global Assembly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lateeful-Ul-Akbar Li-A’azam 2027 - Nadwat Global Assembly",
    description:
      "The Grandeur Gathering Of Sublime Minds. Tens of thousands in white — breathing the same dhikr, seeking with one voice. 24 January 2027 at Tafawa Balewa Square, Lagos.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="overflow-x-hidden max-w-full"
    >
      <body className="bg-paper text-ink font-body antialiased overflow-x-hidden max-w-full w-full">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()`,
          }}
        />
        <ScrollProgress />
        <Navbar />
        <div className="min-h-screen overflow-x-hidden max-w-full w-full">{children}</div>
        <Footer />
        <AiAssistant />
        <BackToTop />
      </body>
    </html>
  );
}
