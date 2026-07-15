import { Suspense } from "react";
import { fetchMetadata } from "../api";
import MetadataTypePageClient from "./MetadataTypePageClient";

type Props = {
  params: Promise<{ type: string }>;
};

export function generateStaticParams() {
  return [{ type: "clinical" }, { type: "document" }];
}

export default async function MetadataTypePage({ params }: Props) {
  const { type } = await params;
  const data = await fetchMetadata(type);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MetadataTypePageClient data={data} type={type} />
    </Suspense>
  );
}
