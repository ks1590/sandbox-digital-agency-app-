"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/form/Input";
import { type ColumnDef, DataTable } from "@/components/ui/DataTable/DataTable";
import LinkCard from "@/components/ui/LinkCard";
import type { TableDefRow } from "../../types";
import type { MetadataFormData } from "../schema";
import TextPopover from "./TextPopover";



export const DUMMY_DATA: TableDefRow[] = Array.from({ length: 120 }).map(
  (_, i) => ({
    id: i + 1,
    physicalName: "sample",
    dataType: "VARCHAR",
    length: 100,
    required: "必須",
    logicalName: "サンプル",
    description: "これはデザインの見本",
    foreignKey: "キー",
    masterType: "",
    sampleData: "",
  }),
);

export function TableDefGrid({
  subtab,
}: {
  subtab: string;
}) {
  const { register, control } = useFormContext<MetadataFormData>();

  const { fields } = useFieldArray({
    control,
    name: `tableDefs.${subtab}`,
  });

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
        <Input
          blockSize="md"
          className="min-w-[160px]"
          aria-label={`外部キー（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.foreignKey` as const)}
        />
      ),
    },
    {
      key: "masterType",
      label: "マスタ種別",
      render: (row, idx) => (
        <Input
          blockSize="md"
          className="min-w-[160px]"
          aria-label={`マスタ種別（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.masterType` as const)}
        />
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
  const { control } = useFormContext<MetadataFormData>();

  const dataTypes = useWatch({ control, name: "dataTypes" }) || [];
  const dataType = useWatch({ control, name: "dataType" }) || "clinical";
  const tables = useWatch({ control, name: "tables" }) || [];

  // データ種別に応じたリンクカードの定義（デフォルト値）
  const LINK_CARDS_BY_DATA_TYPE: Record<
    string,
    { id: string; title: string }[]
  > = {
    clinical: [
      { id: "disease", title: "傷病" },
      { id: "allergy", title: "薬剤・その他アレルギー等" },
      { id: "examination", title: "感染症・検査" },
    ],
    // その他のデータ種別（デモ用）
    document: [
      { id: "prescription", title: "処方箋" },
      { id: "referral", title: "紹介状" },
    ],
  };

  // テーブル一覧に登録されている内容からリンクカードを生成
  // 何も登録されていない場合はデフォルトのカードを表示
  const currentCards = tables.length > 0
    ? tables.map((t, idx) => ({
        id: t.id || t.physicalName || `table-${idx}`,
        title: t.logicalName || `テーブル ${idx + 1}`
      }))
    : (LINK_CARDS_BY_DATA_TYPE[dataType] || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {currentCards.map((card) => (
        <LinkCard
          key={card.id}
          href={`${pathname}?mode=edit&tab=table-def&subtab=${card.id}`}
          title={card.title}
        />
      ))}
    </div>
  );
}
