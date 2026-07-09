"use client";

import { useEffect, useState } from "react";
import type { MetadataResponse } from "../../types";
import type { MetadataFormData } from "../schema";

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
  const updateFrequencies =
    sessionData?.updateFrequencies || apiData.overview.updateFrequencies;
  const tables = sessionData?.tables || apiData.overview.tables;
  const notesText = sessionData?.notesText || apiData.overview.notesText;

  return (
    <div className="space-y-10 py-6 text-gray-900">
      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {overviewText}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">収集期間</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold mb-1">収集開始年度</h4>
            <p className="text-gray-700">{startYear}</p>
          </div>
          <div>
            <h4 className="font-bold mb-1">最新の提供可能年度</h4>
            <p className="text-gray-700">{latestYear}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">更新頻度</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left font-bold text-gray-900 border-r border-gray-300 w-1/2">
                  対象項目
                </th>
                <th className="py-3 px-4 text-left font-bold text-gray-900 w-1/2">
                  頻度
                </th>
              </tr>
            </thead>
            <tbody>
              {updateFrequencies.map(
                (
                  freq: { target: string; frequency: string },
                  index: number,
                ) => (
                  <tr
                    key={`${freq.target}-${index.toString()}`}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-700 border-r border-gray-200">
                      {freq.target}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {freq.frequency}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
        <div className="space-y-8">
          {tables.map(
            (table: { name: string; overview: string; unit: string }) => (
              <div key={table.name}>
                <h4 className="text-lg text-gray-600 font-bold mb-3 border-l-4 border-gray-400 pl-3">
                  {table.name}
                </h4>
                <div className="space-y-4 text-sm ml-4">
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
