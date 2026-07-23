"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../api";
import type { MetadataResponse } from "../types";
import MetadataDetailPageClient from "./MetadataDetailPageClient";

export default function MetadataDetailLoader() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";

  const [data, setData] = useState<MetadataResponse | null>(null);

  useEffect(() => {
    fetchMetadata(type).then(setData).catch(console.error);
  }, [type]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return <MetadataDetailPageClient data={data} type={type} />;
}
