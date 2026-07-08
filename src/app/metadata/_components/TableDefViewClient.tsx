"use client";

import { useEffect, useState } from "react";
import {
  type ColumnDef,
  DataTable,
} from "@/components/ui/DataTable/DataTable";
import type { TableDefRow } from "../types";
import { useMetadata } from "../useMetadata";
import TextPopover from "./TextPopover";

const tableColumns: ColumnDef<TableDefRow>[] = [
  { key: "id", label: "項番" },
  { key: "physicalName", label: "物理名" },
  { key: "dataType", label: "データ型" },
  { key: "length", label: "桁数" },
  { key: "required", label: "必須/任意" },
  { key: "logicalName", label: "論理名" },
  {
    key: "description",
    label: "項目説明",
    render: (row) => (
      <TextPopover text={String(row.description || "")} maxLength={20} />
    ),
  },
  { key: "foreignKey", label: "外部キー" },
  { key: "masterType", label: "マスタ種別" },
  {
    key: "sampleData",
    label: "サンプルデータ",
    render: (row) => (
      <TextPopover text={String(row.sampleData || "")} maxLength={20} />
    ),
  },
];

export function SortableTableWithColumns({
  subtab,
}: {
  subtab: "disease" | "allergy" | "examination";
}) {
  const { data: apiData, isLoading, error } = useMetadata();
  const [sessionOverride, setSessionOverride] = useState<
    TableDefRow[] | null
  >(null);

  // sessionStorageに編集済みデータがあれば優先する
  useEffect(() => {
    const saved = sessionStorage.getItem("metadata_clinical");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tableDefs?.[subtab]) {
          setSessionOverride(parsed.tableDefs[subtab]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [subtab]);

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
  if (isLoading || !apiData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">データを読み込み中...</p>
      </div>
    );
  }

  // sessionStorageに編集済みデータがあればそちらを優先
  const data = sessionOverride || apiData.tableDefs[subtab];

  return (
    <DataTable
      columns={tableColumns}
      data={data}
      rowKey={(row) => String(row.id)}
    />
  );
}

