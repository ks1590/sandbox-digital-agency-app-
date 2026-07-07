"use client";

import { DataTable, type ColumnDef } from "../../../components/ui/DataTable/DataTable";
import TextPopover from "./TextPopover";
import type { TableDefRow } from "./TableDefContent";

const tableColumns: ColumnDef<any>[] = [
  { key: "id", label: "項番" },
  { key: "physicalName", label: "物理名" },
  { key: "dataType", label: "データ型" },
  { key: "length", label: "桁数" },
  { key: "required", label: "必須/任意" },
  { key: "logicalName", label: "論理名" },
  { 
    key: "description", 
    label: "項目説明",
    render: (row) => <TextPopover text={String(row.description || "")} maxLength={20} />
  },
  { key: "foreignKey", label: "外部キー" },
  { key: "masterType", label: "マスタ種別" },
  { 
    key: "sampleData", 
    label: "サンプルデータ",
    render: (row) => <TextPopover text={String(row.sampleData || "")} maxLength={20} />
  },
];

export function SortableTableWithColumns({ data }: { data: any[] }) {
  return <DataTable columns={tableColumns} data={data} rowKey={(row) => row.id || row.no} />;
}

