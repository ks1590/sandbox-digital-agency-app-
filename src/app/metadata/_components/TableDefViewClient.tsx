"use client";

import SortableTable from "../../../components/ui/SortableTable";
import type { Column, RowData } from "../../../components/ui/SortableTable";
import TextPopover from "./TextPopover";

const tableColumns: Column[] = [
  { key: "no", label: "項番" },
  { key: "logicalName", label: "論理名" },
  { key: "physicalName", label: "物理名" },
  { key: "dataType", label: "データ型" },
  { key: "required", label: "必須/任意" },
  { 
    key: "sample", 
    label: "サンプルデータ",
    format: (value) => <TextPopover text={String(value)} maxLength={10} />
  },
];

export function SortableTableWithColumns({ data }: { data: RowData[] }) {
  return <SortableTable columns={tableColumns} data={data} sortable={false} />;
}
