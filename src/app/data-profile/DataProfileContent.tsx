"use client";

import { useState } from "react";
import { type ColumnDef, DataTable } from "@/components/ui/DataTable/DataTable";
import Tab from "@/components/ui/Tab";
import { MOCK_DATA_BY_TYPE } from "./api";
import {
  DATA_PROFILE_DATA_TYPES,
  DATA_PROFILE_PERIOD_END,
  DATA_PROFILE_PERIOD_START,
} from "./constants";
import type {
  DataProfileCategory,
  DataProfileResponse,
  DataProfileRow,
} from "./types";

// カラム定義は静的なため、再レンダーごとの再生成を避けてコンポーネント外に定義する
const DATA_PROFILE_COLUMNS: ColumnDef<DataProfileRow>[] = [
  {
    key: "rowNumber",
    label: "項番",
    render: (_row, idx) => idx + 1,
  },
  { key: "physicalName", label: "物理名" },
  { key: "logicalName", label: "論理名" },
  { key: "maxLength", label: "最大長" },
  { key: "avgLength", label: "平均長" },
  { key: "distinctCount", label: "個別値の数" },
  { key: "maxValue", label: "最大値" },
  { key: "minValue", label: "最小値" },
  { key: "validRatio", label: "有効値割合" },
  { key: "invalidRatio", label: "無効値割合" },
  { key: "nullRatio", label: "null値割合" },
];

function DataProfileGrid({ rows }: { rows: DataProfileRow[] }) {
  return (
    <div className="py-6">
      <DataTable
        data={rows}
        columns={DATA_PROFILE_COLUMNS}
        rowKey={(row) => row.id}
      />
    </div>
  );
}

export default function DataProfileContent({
  data: initialData,
}: {
  data: DataProfileResponse;
}) {
  const [selectedDataType, setSelectedDataType] = useState<string>("clinical");

  // 選択されたデータ種別に応じたデータを取得（未指定または見つからない場合は初期データにフォールバック）
  const currentData =
    selectedDataType === "clinical"
      ? initialData || MOCK_DATA_BY_TYPE.clinical
      : MOCK_DATA_BY_TYPE[selectedDataType] || initialData;

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-2">集計対象期間</h3>
        <p className="text-base text-gray-900 font-bold">
          {DATA_PROFILE_PERIOD_START}
          <span className="mx-2 font-normal">から</span>{" "}
          {DATA_PROFILE_PERIOD_END}
        </p>
      </div>

      <div className="mb-8">
        <label
          htmlFor="dataProfileDataType"
          className="block text-xl font-bold text-gray-900 mb-4"
        >
          データ種別
        </label>
        <div className="relative w-1/2 md:w-1/4 lg:w-1/6">
          <select
            id="dataProfileDataType"
            className="w-full appearance-none rounded-[8px] border border-solid-gray-600 bg-white px-4 py-3 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
          >
            {DATA_PROFILE_DATA_TYPES.map((dt) => (
              <option key={dt.id} value={dt.id}>
                {dt.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-8 mb-4 text-base font-bold text-gray-900">
        <p>合計行数：{currentData.totalRows.toLocaleString()}件</p>
        <p>合計ファイル数：{currentData.totalFiles.toLocaleString()}件</p>
      </div>

      <Tab
        key={selectedDataType}
        headingId="data-profile-tabs-heading"
        items={currentData.categories.map((category: DataProfileCategory) => ({
          label: category.label,
          id: `tab-${category.categoryId}`,
          content: <DataProfileGrid rows={category.rows} />,
        }))}
      />
    </>
  );
}

