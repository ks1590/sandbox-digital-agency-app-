"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../api";
import type { MetadataResponse } from "../types";
import MetadataDetailPageClient from "./MetadataDetailPageClient";

export default function MetadataDetailLoader() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "臨床情報";
  const mode = searchParams?.get("mode");

  const [data, setData] = useState<MetadataResponse | null>(null);

  useEffect(() => {
    // typeまたはmode（編集/参照切り替えなど）が変化した際に最新データを取得
    void mode;
    fetchMetadata(type).then(setData).catch(console.error);
  }, [type, mode]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return <MetadataDetailPageClient key={type} data={data} type={type} />;
}
