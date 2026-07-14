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
}: {
  data: MetadataResponse;
}) {
  const [sessionData, setSessionData] = useState<MetadataFormData | null>(null);

  // sessionStorageに編集済みデータがあれば優先する
  useEffect(() => {
    const saved = sessionStorage.getItem("metadata_clinical");
    if (saved) {
      try {
        setSessionData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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
        <h3 className="text-xl font-bold mb-4">概要</h3>
        {overviewText ? (
          <MarkdownEditor markdown={overviewText} readOnly={true} />
        ) : (
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            データがありません
          </p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">収集期間</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold mb-1">収集開始年度</h4>
            <p className="text-gray-700">{startYear}年</p>
          </div>
          <div>
            <h4 className="font-bold mb-1">最新の提供可能年度</h4>
            <p className="text-gray-700">{latestYear}年</p>
          </div>
          {collectionFrequency && (
            <div>
              <h4 className="font-bold mb-1">収集頻度</h4>
              <p className="text-gray-700">{collectionFrequency}</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">更新頻度</h3>
        <div className="overflow-x-auto">
          <DataTable
            data={updateFrequencies}
            columns={[
              { key: "target", label: "対象項目", className: "w-1/2" },
              { key: "frequency", label: "頻度", className: "w-1/2" },
            ]}
            rowKey={(row) => row.target}
            hidePageSizeOptions={true}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
        <div className="space-y-8">
          {tables.map(
            (
              table: {
                id: string;
                logicalName: string;
                physicalName: string;
                overview: string;
                unit: string;
              },
              index: number,
            ) => (
              <div key={table.id || index.toString()}>
                <h4 className="text-lg text-gray-900 mb-3">
                  {table.logicalName}
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <h5 className="font-bold mb-1">概要</h5>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {table.overview}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">格納単位</h5>
                    <p className="text-gray-700">{table.unit}</p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">留意事項</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {notesText}
        </p>
      </section>
    </div>
  );
}
