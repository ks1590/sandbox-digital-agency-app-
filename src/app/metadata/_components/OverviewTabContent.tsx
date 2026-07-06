"use client";

import { useState } from "react";
import { inputClass, textareaClass, labelClass } from "./styles";
import KeyInfoSection from "./KeyInfoSection";
import DataTypeListEditor from "./DataTypeListEditor";

interface OverviewTabContentProps {
  /** /metadata 直下の編集画面かどうか */
  isTopPage: boolean;
}

/**
 * 概要タブのコンテンツ
 *
 * isTopPage の値に応じて表示する項目を切り替える：
 * - トップページ: 概要 + データ種別エディタ + キー情報
 * - 配下ページ:   データ種別セレクト + 概要 + 収集期間 + 更新頻度 + テーブル一覧 + 留意事項 + キー情報
 */
export default function OverviewTabContent({
  isTopPage,
}: OverviewTabContentProps) {
  const [dataTypes, setDataTypes] = useState([
    { id: "clinical", name: "臨床情報" },
    { id: "document", name: "文書情報" },
    { id: "attachment", name: "添付情報" },
    { id: "health-check", name: "健診文書" },
    { id: "prescription", name: "処方情報" },
  ]);

  return (
    <div className="space-y-10 py-6">
      {/* データ種別セレクト（配下ページのみ） */}
      {!isTopPage && (
        <div className="mb-4">
          <label htmlFor="dataType" className={labelClass}>
            データ種別
          </label>
          <span className="relative inline-block w-64">
            <select
              id="dataType"
              className="block w-full h-14 appearance-none border border-gray-400 rounded-[8px] bg-white pl-4 pr-10 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300"
              defaultValue="clinical"
            >
              <option value="clinical">臨床情報</option>
              <option value="claim">レセプト情報</option>
              <option value="health_check">健診情報</option>
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      )}

      {/* 概要 */}
      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <label htmlFor="overviewText" className="sr-only">
          概要の説明
        </label>
        <textarea
          id="overviewText"
          className={textareaClass}
          defaultValue="概要の説明 概要の説明 概要の説明..."
        />
      </section>

      {/* データ種別エディタ（トップページのみ） */}
      {isTopPage && (
        <DataTypeListEditor
          dataTypes={dataTypes}
          onChange={setDataTypes}
        />
      )}

      {/* 配下ページ専用セクション */}
      {!isTopPage && (
        <>
          <section>
            <h3 className="text-xl font-bold mb-4">収集期間</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label htmlFor="startYear" className={labelClass}>
                  収集開始年度
                </label>
                <input
                  type="text"
                  id="startYear"
                  className={inputClass}
                  defaultValue="2020年"
                />
              </div>
              <div>
                <label htmlFor="latestYear" className={labelClass}>
                  最新の提供可能年度
                </label>
                <input
                  type="text"
                  id="latestYear"
                  className={inputClass}
                  defaultValue="2026年"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">更新頻度</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm border border-gray-300">
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
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 border-r border-gray-200">
                      <input
                        type="text"
                        aria-label="対象項目1"
                        className={inputClass}
                        defaultValue="項目名A"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        aria-label="頻度1"
                        className={inputClass}
                        defaultValue="年次"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 border-r border-gray-200">
                      <input
                        type="text"
                        aria-label="対象項目2"
                        className={inputClass}
                        defaultValue="項目名B"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        aria-label="頻度2"
                        className={inputClass}
                        defaultValue="月次"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
            <div className="space-y-8">
              <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <h4 className="text-lg text-gray-900 font-bold mb-4 border-l-4 border-[#0017C1] pl-3">
                  〇〇テーブル
                </h4>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="table1Overview" className={labelClass}>
                      概要
                    </label>
                    <textarea
                      id="table1Overview"
                      className={textareaClass}
                      defaultValue="テーブル概要の説明..."
                    />
                  </div>
                  <div>
                    <label htmlFor="table1Unit" className={labelClass}>
                      格納単位
                    </label>
                    <input
                      type="text"
                      id="table1Unit"
                      className={inputClass}
                      defaultValue="レセプト"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <h4 className="text-lg text-gray-900 font-bold mb-4 border-l-4 border-[#0017C1] pl-3">
                  △△テーブル
                </h4>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="table2Overview" className={labelClass}>
                      概要
                    </label>
                    <textarea
                      id="table2Overview"
                      className={textareaClass}
                      defaultValue="テーブル概要の説明..."
                    />
                  </div>
                  <div>
                    <label htmlFor="table2Unit" className={labelClass}>
                      格納単位
                    </label>
                    <input
                      type="text"
                      id="table2Unit"
                      className={inputClass}
                      defaultValue="レセプト"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">留意事項</h3>
            <label htmlFor="notesText" className="sr-only">
              留意事項
            </label>
            <textarea
              id="notesText"
              className={textareaClass}
              defaultValue="留意事項を入力..."
            />
          </section>
        </>
      )}

      {/* キー情報（共通） */}
      <KeyInfoSection />
    </div>
  );
}
