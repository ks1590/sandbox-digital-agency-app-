"use client";

import {
  type ColumnDef,
  DataTable,
} from "../../components/ui/DataTable/DataTable";
import Tab from "../../components/ui/Tab";
import type { DataProfileCategory, DataProfileRow } from "./types";
import { useDataProfile } from "./useDataProfile";

function DataProfileGrid({ rows }: { rows: DataProfileRow[] }) {
  const columns: ColumnDef<DataProfileRow>[] = [
    {
      key: "rowNumber",
      label: "項番",
      render: (_row, idx) => idx + 1,
    },
    { key: "columnName", label: "列の名前" },
    { key: "maxLength", label: "最大長" },
    { key: "avgLength", label: "平均長" },
    { key: "distinctCount", label: "個別値の数" },
    { key: "maxValue", label: "最大値" },
    { key: "minValue", label: "最小値" },
    { key: "validRatio", label: "有効値割合" },
    { key: "invalidRatio", label: "無効値割合" },
    { key: "nullRatio", label: "null値割合" },
  ];

  return (
    <div className="py-6">
      <DataTable data={rows} columns={columns} rowKey={(row) => row.id} />
    </div>
  );
}

export default function DataProfileContent() {
  const { data, isLoading, error } = useDataProfile();

  // エラー表示
  if (error) {
    return (
      <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        <p className="font-bold">データ取得エラー</p>
        <p>{error}</p>
      </div>
    );
  }

  // ローディング表示
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-2">集計対象期間</h3>
        <p className="text-base text-gray-900 font-bold">
          {data.periodFrom}
          <span className="mx-2 font-normal">から</span> {data.periodTo}
        </p>
      </div>

      <div className="flex gap-8 mb-4 text-base font-bold text-gray-900">
        <p>合計行数：{data.totalRows.toLocaleString()}件</p>
        <p>合計ファイル数：{data.totalFiles.toLocaleString()}件</p>
      </div>

      <Tab
        headingId="data-profile-tabs-heading"
        items={data.categories.map((category: DataProfileCategory) => ({
          label: category.label,
          id: `tab-${category.categoryId}`,
          content: <DataProfileGrid rows={category.rows} />,
        }))}
      />
    </>
  );
}
