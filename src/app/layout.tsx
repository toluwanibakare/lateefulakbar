import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Great_Vibes, Amiri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const script = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["400"],
});

const arabic = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

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
      className={`${display.variable} ${body.variable} ${script.variable} ${arabic.variable}`}
    >
      <body className="bg-paper text-ink font-body antialiased">
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <AiAssistant />
      </body>
    </html>
  );
}
