import { Suspense } from "react";
import { fetchMetadata } from "./api";
import MetadataPageClient from "./MetadataPageClient";

export default async function MetadataPage() {
  const data = await fetchMetadata();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MetadataPageClient data={data} />
    </Suspense>
  );
}
