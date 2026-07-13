import { fetchMetadata } from "../api";
import MetadataTypePageClient from "./MetadataTypePageClient";

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateStaticParams() {
  return [
    { type: 'clinical' },
    { type: 'document' },
  ];
}

export default async function MetadataTypePage({
  params,
}: Props) {
  const { type } = await params;
  
  // サーバー側でデータを取得
  const data = await fetchMetadata();

  return <MetadataTypePageClient type={type} data={data} />;
}
