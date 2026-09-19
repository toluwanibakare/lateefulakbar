import PassViewer from "./PassViewer";

export const metadata = {
  title: "Your Official Event Pass & Ticket | Lateeful-Ul-Akbar 2027",
  description: "View and download your official accreditation pass artwork for Lateeful-Ul-Akbar 2027.",
};

export default async function PassPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  return <PassViewer passCode={resolvedParams.code} />;
}
