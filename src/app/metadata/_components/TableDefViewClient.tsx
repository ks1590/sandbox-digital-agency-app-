"use client";

import { useEffect, useState } from "react";
import {
  type ColumnDef,
  DataTable,
} from "@/components/ui/DataTable/DataTable";
import type { MetadataResponse, TableDefRow } from "../types";
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
  data: apiData,
}: {
  subtab: "disease" | "allergy" | "examination";
  data: MetadataResponse;
}) {
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

