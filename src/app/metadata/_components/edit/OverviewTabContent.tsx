"use client";

import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";
import DataTypeListEditor from "./DataTypeListEditor";
import TableDefinitionLinks from "./TableDefinitionLinks";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), {
  ssr: false,
});

interface OverviewTabContentProps {
  /** /metadata 直下の編集画面かどうか */
  isTopPage: boolean;
}

/**
 * 概要タブのコンテンツ
 */
export default function OverviewTabContent({
  isTopPage,
}: OverviewTabContentProps) {
  const { control, watch, setValue } = useFormContext<MetadataFormData>();

  const dataTypes = watch("dataTypes") || [];

  return (
    <div className="space-y-10 py-6">
      {/* テーブル定義と紐づける（子ページのみ） */}
      {!isTopPage && <TableDefinitionLinks />}

      {/* 概要 */}
      <section>
        <div className="flex items-center justify-end mb-2">
          <label htmlFor="overviewText" className="sr-only">
            概要の説明
          </label>
          <div className="group relative flex items-center text-sm text-[#0017C1] font-bold cursor-pointer hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <title>記入項目の情報</title>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>記入項目</span>
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="w-[400px] p-2 bg-white border border-gray-900 text-sm font-normal text-gray-900 shadow-md cursor-auto">
                <div className="font-bold mb-2 border-b border-gray-900 pb-1">
                  記入項目
                </div>
                {isTopPage ? (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>データ説明情報</li>
                    <li>キー情報</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>データ説明情報</li>
                    <li>
                      収集期間
                      <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-600">
                        <li>収集開始年度</li>
                        <li>最新の提供可能年度</li>
                        <li>収集頻度</li>
                      </ul>
                    </li>
                    <li>更新頻度</li>
                    <li>
                      テーブル一覧
                      <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-600">
                        <li>テーブル物理名</li>
                        <li>テーブル論理名</li>
                        <li>概要</li>
                        <li>格納単位</li>
                      </ul>
                    </li>
                    <li>留意事項</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <Controller
          name="overviewText"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MarkdownEditor markdown={value || ""} onChange={onChange} />
          )}
        />
      </section>

      {/* データ種別エディタ（トップページのみ） */}
      {isTopPage && (
        <DataTypeListEditor
          dataTypes={dataTypes}
          onChange={(val) => setValue("dataTypes", val, { shouldDirty: true })}
        />
      )}
    </div>
  );
}
