"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "../../../components/form/Input";
import {
  type ColumnDef,
  DataTable,
} from "../../../components/ui/DataTable/DataTable";
import LinkCard from "../../../components/ui/LinkCard";

import type { MetadataFormData } from "./schema";

export interface TableDefRow {
  id: number;
  physicalName: string;
  dataType: string;
  length: number | string;
  required: string;
  logicalName: string;
  description: string;
  foreignKey: string;
  masterType: string;
  sampleData: string;
}

function PopoverTextarea({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
  align = "left",
}: {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
  align?: "left" | "right";
}) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Input
        blockSize="md"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pr-8"
        onFocus={() => setExpanded(true)}
      />
      {/* 展開アイコン（ヒント用） */}
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>

      {expanded && (
        <textarea
          className={`absolute top-0 ${align === "right" ? "right-0" : "left-0"} w-full min-h-[160px] resize-y bg-white rounded-[8px] border border-solid-gray-600 px-4 py-3 text-base text-gray-900 shadow-xl z-50 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-2 focus:ring-2 focus:ring-yellow-300`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          // biome-ignore lint/a11y/noAutofocus: intentional for popover textarea
          autoFocus
          onBlur={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

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
  subtab: "disease" | "allergy" | "examination";
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
    { key: "physicalName", label: "物理名", className: "min-w-[200px]" },
    { key: "dataType", label: "データ型" },
    { key: "length", label: "桁数" },
    { key: "required", label: "必須/任意" },
    {
      key: "logicalName",
      label: "論理名",
      render: (row, idx) => (
        <Input
          blockSize="md"
          placeholder="入力テキスト"
          className="min-w-[160px]"
          aria-label={`論理名（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.logicalName` as const)}
        />
      ),
    },
    {
      key: "description",
      label: "項目説明",
      render: (row, idx) => {
        const reg = register(`tableDefs.${subtab}.${idx}.description` as const);
        return (
          <PopoverTextarea
            value={row.description}
            onChange={reg.onChange}
            placeholder="項目説明を入力"
            className="min-w-[250px]"
            ariaLabel={`項目説明（項番${row.id}）`}
          />
        );
      },
    },
    {
      key: "foreignKey",
      label: "外部キー",
      render: (row, idx) => (
        <Input
          blockSize="md"
          placeholder="入力テキスト"
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
          placeholder="入力テキスト"
          className="min-w-[160px]"
          aria-label={`マスタ種別（項番${row.id}）`}
          {...register(`tableDefs.${subtab}.${idx}.masterType` as const)}
        />
      ),
    },
    {
      key: "sampleData",
      label: "サンプルデータ",
      render: (row, idx) => {
        const reg = register(`tableDefs.${subtab}.${idx}.sampleData` as const);
        return (
          <PopoverTextarea
            value={row.sampleData}
            onChange={reg.onChange}
            placeholder="サンプルデータを入力"
            className="min-w-[250px]"
            ariaLabel={`サンプルデータ（項番${row.id}）`}
            align="right"
          />
        );
      },
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

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=disease`}
          title="傷病"
        />
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=allergy`}
          title="アレルギー"
        />
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=examination`}
          title="検査"
        />
      </div>
    </div>
  );
}
