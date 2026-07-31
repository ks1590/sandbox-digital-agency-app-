import { Suspense } from "react";
import MetadataDetailLoader from "./MetadataDetailLoader";

export default function MetadataDetailPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <MetadataDetailLoader />
    </Suspense>
  );
}
