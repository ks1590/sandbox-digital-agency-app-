import { Suspense } from "react";
import { fetchMetadata } from "../api";
import MetadataTableDefPageClient from "./MetadataTableDefPageClient";

export default async function TableDefPage() {
  const data = await fetchMetadata();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MetadataTableDefPageClient data={data} />
    </Suspense>
  );
}
