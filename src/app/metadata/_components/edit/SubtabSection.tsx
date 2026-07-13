"use client";

import { useRouter } from "next/navigation";
import Tab from "@/components/ui/Tab";
import { TableDefGrid } from "../table-def/TableDefContent";

interface SubtabSectionProps {
  /** 現在のサブタブ（disease | allergy | examination） */
  subtabParam: string;
  /** 現在のパス名 */
  pathname: string;
}

/** サブタブ名とインデックスのマッピング */
const SUBTAB_MAP = ["disease", "allergy", "examination"] as const;

/**
 * テーブル定義のサブタブセクション
 * 傷病・アレルギー・検査の3タブ切替 + TableDefGrid を表示する
 */
export default function SubtabSection({
  subtabParam,
  pathname,
}: SubtabSectionProps) {
  const router = useRouter();

  const defaultIndex =
    subtabParam === "allergy" ? 1 : subtabParam === "examination" ? 2 : 0;

  const handleSubtabChange = (index: number) => {
    const newSubtab = SUBTAB_MAP[index] || "disease";
    router.push(`${pathname}?mode=edit&tab=table-def&subtab=${newSubtab}`);
  };

  return (
    <div className="mb-12">
      <Tab
        headingId="subtab-tabs-heading"
        defaultIndex={defaultIndex}
        onChange={handleSubtabChange}
        items={[
          {
            label: "傷病",
            id: "subtab-disease",
            content: (
              <div className="py-6">
                <TableDefGrid subtab="disease" />
              </div>
            ),
          },
          {
            label: "薬剤・その他アレルギー等",
            id: "subtab-allergy",
            content: (
              <div className="py-6">
                <TableDefGrid subtab="allergy" />
              </div>
            ),
          },
          {
            label: "感染症・検査",
            id: "subtab-examination",
            content: (
              <div className="py-6">
                <TableDefGrid subtab="examination" />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
