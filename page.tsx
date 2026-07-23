import { Suspense } from "react";
import MetadataLoader from "./MetadataLoader";

export default function MetadataPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <MetadataLoader />
    </Suspense>
  );
}
