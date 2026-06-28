"use client";

import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationCurrent,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from "./Pagination";

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
export interface Column {
  key: string;
  label: string;
  format?: (value: string | number) => React.ReactNode;
}

/** サンプルデータの行型定義 */
export interface RowData {
  [key: string]: string | number;
}

export interface ColumnGroup {
  label: string;
  colSpan: number;
}

interface SortableTableProps {
  groups?: ColumnGroup[];
  columns: Column[];
  data: RowData[];
  sortable?: boolean;
}

/**
 * ソート可能なテーブルヘッダー（SortableHeader）
 *
 * design-example/components/Table/Table.stories.tsx の SortableHeader パターンを
 * Next.js App Router 向けに Client Component として実装。
 * 実際にデータのソートが動作するよう拡張。
 */
export default function SortableTable({
  groups,
  columns,
  data,
  sortable = true,
}: SortableTableProps) {
  /** ソート状態管理（key: カラムインデックス） */
  const [sortState, setSortState] = useState<{
    columnIndex: number | null;
    direction: Sort;
  }>({ columnIndex: null, direction: undefined });

  /** ソートボタンクリック時の処理 */
  const handleSortClick = (columnIndex: number) => {
    if (!sortable) return;
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
    if (
      !sortable ||
      sortState.columnIndex === null ||
      sortState.direction === undefined
    )
      return data;

    const key = columns[sortState.columnIndex].key;
    const sorted = [...data].sort((a, b) => {
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
  }, [sortable, sortState, data, columns]);

  /** カラムのソート状態を取得 */
  const getSortForColumn = (index: number): Sort => {
    if (!sortable) return undefined;
    if (sortState.columnIndex === index) return sortState.direction;
    return undefined;
  };

  /** ページネーション状態管理 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPage = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // データが減って現在のページが存在しなくなった場合の対応
  if (currentPage > maxPage && maxPage > 0) {
    setCurrentPage(maxPage);
  }

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border border-solid-gray-420 text-std-16N-170 bg-white">
          <thead>
            {groups && groups.length > 0 && (
              <tr className="bg-solid-gray-100">
                {groups.map((group, i) => (
                  <th
                    key={i}
                    className="border-b border-r border-solid-gray-500 px-4 py-5 text-start align-top last:border-r-0"
                    colSpan={group.colSpan}
                    scope="col"
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            )}
            <tr className="border-b border-black bg-solid-gray-100">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className="border-r border-solid-gray-500 px-4 py-3 text-start align-top last:border-r-0"
                  scope="col"
                  aria-sort={getSortForColumn(i) || "none"}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start py-2">
                      {sortable ? (
                        <button
                          className="inline-flex items-start gap-x-1 text-start underline underline-offset-[calc(3/16*1rem)] hover:decoration-[calc(3/16*1rem)] focus-visible:rounded-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:bg-yellow-300 focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300"
                          type="button"
                          onClick={() => {
                            handleSortClick(i);
                            setCurrentPage(1); // ソート時に1ページ目に戻す
                          }}
                        >
                          {col.label}
                          <span className="pt-0.5">
                            <SortIcon sort={getSortForColumn(i)} />
                          </span>
                        </button>
                      ) : (
                        <span className="font-bold">{col.label}</span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="border-r border-solid-gray-420 px-4 py-5 align-top last:border-r-0"
                  >
                    {col.format
                      ? col.format(row[col.key])
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maxPage > 1 && (
        <div className="flex justify-end mt-2">
          <Pagination>
            <PaginationFirst
              href="#"
              onClick={(e) => handlePageChange(e, 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
            <PaginationPrev
              href="#"
              onClick={(e) => handlePageChange(e, currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
            <PaginationCurrent current={currentPage} max={maxPage} />
            <PaginationNext
              href="#"
              onClick={(e) => handlePageChange(e, currentPage + 1)}
              aria-disabled={currentPage === maxPage}
              className={
                currentPage === maxPage ? "pointer-events-none opacity-50" : ""
              }
            />
            <PaginationLast
              href="#"
              onClick={(e) => handlePageChange(e, maxPage)}
              aria-disabled={currentPage === maxPage}
              className={
                currentPage === maxPage ? "pointer-events-none opacity-50" : ""
              }
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
