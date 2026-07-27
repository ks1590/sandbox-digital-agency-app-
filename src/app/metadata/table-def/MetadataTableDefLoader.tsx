"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../api";
import type { MetadataResponse } from "../types";
import MetadataTableDefPageClient from "./MetadataTableDefPageClient";
export default function MetadataTableDefLoader() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams?.get("mode") === "edit";
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

  return <MetadataTableDefPageClient data={data} />;
}
