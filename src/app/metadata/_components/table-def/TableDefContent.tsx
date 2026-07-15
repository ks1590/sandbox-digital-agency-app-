"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/form/Input";
import { Radio } from "@/components/form/Radio";
import { type ColumnDef, DataTable } from "@/components/ui/DataTable/DataTable";
import LinkCard from "@/components/ui/LinkCard";
import type { TableDefRow } from "../../types";
import type { MetadataFormData } from "../schema";
import TextPopover from "./TextPopover";

// PopoverTextarea has been removed as per user request
export const DUMMY_DATA: TableDefRow[] = Array.from({ length: 120 }).map(
  (_, i) => ({
    id: i + 1,
    physicalName: "sample",
    dataType: "VARCHAR",
    length: 100,
    required: "必須",
    logicalName: "サンプル",
    description: "これはデザインの見本",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "",
  }),
);

export function TableDefGrid({ subtab }: { subtab: string }) {
  const { register, control } = useFormContext<MetadataFormData>();

  const { fields, append } = useFieldArray({
    control,
    name: `tableDefs.${subtab}`,
  });

  useEffect(() => {
    if (fields.length === 0 && subtab) {
      // 物理名が変更されてデータがない場合はダミーデータを初期表示する
      append(DUMMY_DATA.slice(0, 10)); // 120件は多いので最初の10件をセット
    }
  }, [fields.length, subtab, append]);

  // DataTableが要求するデータ型に合わせてfieldsを使用
  // ただし各行のレンダリング時にはreact-hook-formのregisterを使用する
  const columns: ColumnDef<(typeof fields)[0]>[] = [
    {
      key: "id",
      label: "項番",
      render: (_row, idx) => idx + 1,
    },
    {
      key: "physicalName",
      label: "物理名",
      className: "min-w-[200px]",
      render: (row) => (
        <TextPopover text={String(row.physicalName || "")} maxLength={20} />
      ),
    },
    { key: "dataType", label: "データ型" },
    { key: "length", label: "桁数" },
    {
      key: "required",
      label: "必須/任意",
      render: (row) => (
        <TextPopover text={String(row.required || "")} maxLength={20} />
      ),
    },
    {
      key: "logicalName",
      label: "論理名",
      render: (row, idx) => (
        <Input
          blockSize="md"
          className="min-w-[160px]"
          aria-label={`論理名（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.logicalName` as const)}
        />
      ),
    },
    {
      key: "description",
      label: "項目説明",
      className: "w-[400px] min-w-[400px] max-w-[400px]",
      render: (row, idx) => (
        <Input
          blockSize="md"
          className="w-full"
          placeholder="項目説明を入力"
          aria-label={`項目説明（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.description` as const)}
        />
      ),
    },
    {
      key: "foreignKey",
      label: "外部キー",
      render: (row, idx) => (
        <div className="flex items-center gap-4 min-w-[160px]">
          <Radio
            value="はい"
            {...register(`tableDefs.${subtab}.${idx}.foreignKey` as const)}
          >
            はい
          </Radio>
          <Radio
            value="いいえ"
            {...register(`tableDefs.${subtab}.${idx}.foreignKey` as const)}
          >
            いいえ
          </Radio>
        </div>
      ),
    },
    {
      key: "masterType",
      label: "マスタ種別",
      render: (row, idx) => (
        <div className="relative min-w-[200px]">
          <select
            className="w-full appearance-none rounded-[8px] border border-solid-gray-600 bg-white px-4 py-2 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
            aria-label={`マスタ種別（項番${row.id}）`}
            {...register(`tableDefs.${subtab}.${idx}.masterType` as const)}
          >
            <option value="">選択してください</option>
            <option value="医療機関等マスタ">医療機関等マスタ</option>
            <option value="傷病名マスタ">傷病名マスタ</option>
            <option value="医薬品マスタ">医薬品マスタ</option>
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
      ),
    },
    {
      key: "sampleData",
      label: "サンプルデータ",
      className: "w-[400px] min-w-[400px] max-w-[400px]",
      render: (row, idx) => (
        <Input
          blockSize="md"
          className="w-full"
          placeholder="サンプルデータを入力"
          aria-label={`サンプルデータ（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.sampleData` as const)}
        />
      ),
    },
  ];

  return (
    <div className="mt-4">
      <DataTable data={fields} columns={columns} rowKey={(row) => row.id} />
    </div>
  );
}

export default function TableDefContent() {
  const pathname = usePathname();
  const { watch } = useFormContext<MetadataFormData>();

  const tables = watch("tables") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {tables.map((table) => {
        // 物理名が未入力の場合はカードを生成しない、もしくはデフォルト値を設定するなど
        if (!table.physicalName) return null;
        return (
          <LinkCard
            key={table.id || table.physicalName}
            href={`${pathname}?mode=edit&tab=table-def&subtab=${table.physicalName}`}
            title={table.logicalName || table.physicalName}
          />
        );
      })}
      {tables.length === 0 && (
        <div className="col-span-3 text-center text-gray-500">
          テーブル定義が紐付けられていません。「概要」タブでテーブルを追加してください。
        </div>
      )}
    </div>
  );
}
