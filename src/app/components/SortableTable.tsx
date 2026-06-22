"use client";

import { useState, useMemo } from "react";

/** ソート方向の型定義 */
type Sort = "ascending" | "descending" | undefined;

/** ソートアイコンコンポーネント（デジタル庁デザインシステム準拠） */
function SortIcon({ sort }: { sort: Sort }) {
  if (sort) {
    return (
      <svg
        className={sort === "descending" ? "rotate-180" : ""}
        width="24"
        height="24"
        fill="black"
        aria-hidden={true}
      >
        {/* ソート済みアイコン：片方の矢印が強調 */}
        <path d="M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12Z" />
        <path d="M14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" fill="black" aria-hidden="true">
      {/* 未ソートアイコン：両方の矢印が均等 */}
      <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12Z" />
      <path d="M8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z" />
    </svg>
  );
}

/** カラム定義 */
interface Column {
  key: string;
  label: string;
}

/** サンプルデータの行型定義 */
interface RowData {
  [key: string]: string | number;
}

/**
 * ソート可能なテーブルヘッダー（SortableHeader）
 *
 * design-example/components/Table/Table.stories.tsx の SortableHeader パターンを
 * Next.js App Router 向けに Client Component として実装。
 * 実際にデータのソートが動作するよう拡張。
 */
export default function SortableTable() {
  /** カラム定義 */
  const columns: Column[] = [
    { key: "name", label: "プロジェクト名" },
    { key: "ministry", label: "担当府省庁" },
    { key: "budget", label: "予算額（百万円）" },
    { key: "startDate", label: "開始日" },
    { key: "progress", label: "進捗率（%）" },
  ];

  /** サンプルデータ */
  const initialData: RowData[] = [
    {
      name: "マイナンバーカード普及促進",
      ministry: "デジタル庁",
      budget: 12500,
      startDate: "2025/04/01",
      progress: 78,
    },
    {
      name: "ガバメントクラウド移行",
      ministry: "デジタル庁",
      budget: 8900,
      startDate: "2024/10/01",
      progress: 45,
    },
    {
      name: "自治体システム標準化",
      ministry: "総務省",
      budget: 23000,
      startDate: "2024/04/01",
      progress: 62,
    },
    {
      name: "e-Tax機能拡充",
      ministry: "国税庁",
      budget: 3200,
      startDate: "2025/01/15",
      progress: 91,
    },
    {
      name: "デジタル教科書導入",
      ministry: "文部科学省",
      budget: 15600,
      startDate: "2025/04/01",
      progress: 33,
    },
    {
      name: "オープンデータ基盤整備",
      ministry: "デジタル庁",
      budget: 4800,
      startDate: "2024/07/01",
      progress: 85,
    },
  ];

  /** ソート状態管理（key: カラムインデックス） */
  const [sortState, setSortState] = useState<{
    columnIndex: number | null;
    direction: Sort;
  }>({ columnIndex: null, direction: undefined });

  /** ソートボタンクリック時の処理 */
  const handleSortClick = (columnIndex: number) => {
    setSortState((prev) => {
      if (prev.columnIndex === columnIndex) {
        return {
          columnIndex,
          direction:
            prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { columnIndex, direction: "ascending" };
    });
  };

  /** ソート済みデータ */
  const sortedData = useMemo(() => {
    if (sortState.columnIndex === null || sortState.direction === undefined)
      return initialData;

    const key = columns[sortState.columnIndex].key;
    const sorted = [...initialData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      }
      return String(valA).localeCompare(String(valB), "ja");
    });

    if (sortState.direction === "descending") {
      sorted.reverse();
    }
    return sorted;
  }, [sortState]);

  /** カラムのソート状態を取得 */
  const getSortForColumn = (index: number): Sort => {
    if (sortState.columnIndex === index) return sortState.direction;
    return undefined;
  };

  /** 数値フォーマット */
  const formatValue = (key: string, value: string | number) => {
    if (key === "budget" && typeof value === "number") {
      return value.toLocaleString("ja-JP");
    }
    if (key === "progress" && typeof value === "number") {
      return `${value}%`;
    }
    return String(value);
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full table-fixed border border-solid-gray-420 text-std-16N-170">
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} className="border-r border-solid-gray-420" />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-black divide-x divide-solid-gray-536 bg-solid-gray-100">
            {columns.map((col, i) => (
              <th
                key={col.key}
                className="px-4 py-3 text-start align-top"
                scope="col"
                aria-sort={getSortForColumn(i) || "none"}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start py-2">
                    <button
                      className="inline-flex items-start gap-x-1 text-start underline underline-offset-[calc(3/16*1rem)] hover:decoration-[calc(3/16*1rem)] focus-visible:rounded-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:bg-yellow-300 focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300"
                      type="button"
                      onClick={() => handleSortClick(i)}
                    >
                      {col.label}
                      <span className="pt-0.5">
                        <SortIcon sort={getSortForColumn(i)} />
                      </span>
                    </button>
                  </div>

                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={String(row.name)}
              className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-5 align-top">
                  {formatValue(col.key, row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
