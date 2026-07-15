import { Suspense } from "react";
import MetadataDetailLoader from "./MetadataDetailLoader";

export default function MetadataDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MetadataDetailLoader />
    </Suspense>
  );
}
