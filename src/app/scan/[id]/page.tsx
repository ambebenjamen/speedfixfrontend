import ScanResultClient from "@/components/ScanResultClient";

type ScanPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScanPage({ params }: ScanPageProps) {
  const { id } = await params;
  return <ScanResultClient scanId={id} />;
}
