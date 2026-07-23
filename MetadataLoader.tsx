"use client";

import { useEffect, useState } from "react";
import { fetchMetadata } from "./api";
import MetadataPageClient from "./MetadataPageClient";
import type { MetadataResponse } from "./types";
export default function MetadataLoader() {
  const [data, setData] = useState<MetadataResponse | null>(null);

  useEffect(() => {
    fetchMetadata().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return <MetadataPageClient data={data} />;
}
