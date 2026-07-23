import { Suspense } from "react";
import MetadataTableDefLoader from "./MetadataTableDefLoader";

export default function TableDefPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <MetadataTableDefLoader />
    </Suspense>
  );
}
