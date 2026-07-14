"use client";

import { useRouter } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";
import Tab from "@/components/ui/Tab";
import type { MetadataFormData } from "../schema";
import { TableDefGrid } from "../table-def/TableDefContent";

interface SubtabSectionProps {
  /** 現在のサブタブ（disease | allergy | examination） */
  subtabParam: string;
  /** 現在のパス名 */
  pathname: string;
}

/** サブタブ名とインデックスのマッピング */
const SUBTAB_MAP = ["disease", "allergy", "examination"] as const;

export default function SubtabSection({
  subtabParam,
  pathname,
}: SubtabSectionProps) {
  const router = useRouter();
  const { control } = useFormContext<MetadataFormData>();

  const dataType = useWatch({ control, name: "dataType" }) || "clinical";
  const tables = useWatch({ control, name: "tables" }) || [];

  // デフォルトのサブタブ定義（データがない場合）
  const DEFAULT_SUBTABS = [
    { id: "disease", label: "傷病" },
    { id: "allergy", label: "薬剤・その他アレルギー等" },
    { id: "examination", label: "感染症・検査" },
  ];

  // テーブル一覧に登録されている内容からサブタブを生成
  const subtabs =
    tables.length > 0
      ? tables.map((t, idx) => ({
          id: t.id || t.physicalName || `table-${idx}`,
          label: t.logicalName || `テーブル ${idx + 1}`,
        }))
      : DEFAULT_SUBTABS;

  const defaultIndex = Math.max(
    0,
    subtabs.findIndex((tab) => tab.id === subtabParam),
  );

  const handleSubtabChange = (index: number) => {
    const newSubtab = subtabs[index]?.id || subtabs[0].id;
    router.push(`${pathname}?mode=edit&tab=table-def&subtab=${newSubtab}`);
  };

  return (
    <div className="mb-12">
      <Tab
        headingId="subtab-tabs-heading"
        defaultIndex={defaultIndex}
        onChange={handleSubtabChange}
        items={subtabs.map((tab) => ({
          label: tab.label,
          id: `subtab-${tab.id}`,
          content: (
            <div className="py-6">
              <TableDefGrid subtab={tab.id} />
            </div>
          ),
        }))}
      />
    </div>
  );
}
