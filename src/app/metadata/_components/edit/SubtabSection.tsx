"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import Tab from "@/components/ui/Tab";
import { TableDefGrid } from "../table-def/TableDefContent";
import type { MetadataFormData } from "../schema";

interface SubtabSectionProps {
  /** 現在のサブタブ（physicalName） */
  subtabParam: string;
  /** 現在のパス名 */
  pathname: string;
}

/**
 * テーブル定義のサブタブセクション
 * 入力されたテーブル情報を元に動的にタブを生成する
 */
export default function SubtabSection({
  subtabParam,
  pathname,
}: SubtabSectionProps) {
  const router = useRouter();
  const { watch } = useFormContext<MetadataFormData>();
  const tables = watch("tables") || [];

  // 物理名が入力されているテーブルのみタブとして表示
  const validTables = tables.filter((t) => t.physicalName);

  const defaultIndex = validTables.findIndex(
    (t) => t.physicalName === subtabParam,
  );
  const activeIndex = defaultIndex !== -1 ? defaultIndex : 0;

  const handleSubtabChange = (index: number) => {
    const newSubtab = validTables[index]?.physicalName || "";
    if (newSubtab) {
      router.push(`${pathname}?mode=edit&tab=table-def&subtab=${newSubtab}`);
    }
  };

  if (validTables.length === 0) {
    return (
      <div className="mb-12 text-gray-500">
        テーブルが定義されていません。「概要」タブでテーブルを追加してください。
      </div>
    );
  }

  return (
    <div className="mb-12">
      <Tab
        headingId="subtab-tabs-heading"
        defaultIndex={activeIndex}
        onChange={handleSubtabChange}
        items={validTables.map((table) => ({
          label: table.logicalName || table.physicalName,
          id: `subtab-${table.physicalName}`,
          content: (
            <div className="py-6">
              <TableDefGrid subtab={table.physicalName} />
            </div>
          ),
        }))}
      />
    </div>
  );
}
