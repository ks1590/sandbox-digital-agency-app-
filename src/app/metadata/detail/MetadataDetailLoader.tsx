"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../api";
import MetadataDetailPageClient from "./MetadataDetailPageClient";
import type { MetadataResponse } from "../types";

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
        <p className="text-gray-500">Loading metadata...</p>
      </div>
    );
  }

  return <MetadataDetailPageClient data={data} type={type} />;
}
