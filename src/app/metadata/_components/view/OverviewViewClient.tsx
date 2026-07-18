"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import type { MetadataResponse } from "../../types";
import type { MetadataFormData } from "../schema";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), {
  ssr: false,
});

export default function OverviewViewClient({
  data: apiData,
  type,
}: {
  data: MetadataResponse;
  type?: string;
}) {
  const [sessionData, setSessionData] = useState<MetadataFormData | null>(null);

  // sessionStorageに編集済みデータがあれば優先する
  useEffect(() => {
    const key = type ? `metadata_${type}` : "metadata_top";
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        setSessionData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [type]);

  // sessionStorageに編集済みデータがあればそちらを優先、なければAPIデータを使用
  const overviewText =
    sessionData?.overviewText || apiData.overview.overviewText;
  const startYear = sessionData?.startYear || apiData.overview.startYear;
  const latestYear = sessionData?.latestYear || apiData.overview.latestYear;
  const collectionFrequency =
    sessionData?.collectionFrequency || apiData.overview.collectionFrequency;
  const updateFrequencies =
    sessionData?.updateFrequencies || apiData.overview.updateFrequencies;
  const tables = sessionData?.tables || apiData.overview.tables;
  const notesText = sessionData?.notesText || apiData.overview.notesText;

  return (
    <div className="space-y-10 p-4 text-gray-900">
      <section>
        {overviewText ? (
          <MarkdownEditor
            key={overviewText}
            markdown={overviewText}
            readOnly={true}
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            データがありません
          </p>
        )}
      </section>
    </div>
  );
}
