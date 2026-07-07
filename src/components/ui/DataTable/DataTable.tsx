'use client';

import React, { useState, useMemo, type ReactNode } from 'react';
import {
  Pagination,
  PaginationCurrent,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '../Pagination';

export interface ColumnDef<T> {
  key: string;
  label: string;
  sortable?: boolean;
  /** ソートロジックが必要な場合（デフォルトは string/number として比較） */
  sortValue?: (row: T) => number | string;
  /** カスタムレンダリング（指定がない場合は row[key] を表示） */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** 最小幅などのCSSクラスを追加する場合 */
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizeOptions?: readonly number[];
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
}

/** ソートアイコン */
function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  return (
    <svg
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden
      className={`inline-block ml-1 ${direction === 'desc' ? 'rotate-180' : ''}`}
    >
      {direction ? (
        <>
          <path d="M13 15.12L16.27 12L17 12.7L12.5 17L8 12.7L8.73 12L12 15.12V4H13V15.12Z" />
          <path d="M10 7.92L8.73 9L7 7.52V16H5V7.52L3.27 9L2 7.93L5.5 4L10 7.93Z" />
        </>
      ) : (
        <>
          <path d="M13 15.12L16.27 12L17 12.7L12.5 17L8 12.7L8.73 12L12 15.12V4H13V15.12Z" />
          <path d="M7 4.88L10.27 8L11 7.3L6.5 3L2 7.3L2.73 8L6 4.88V17H7V4.88Z" />
        </>
      )}
    </svg>
  );
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

export function DataTable<T>({
  data,
  columns,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  emptyMessage = '該当するデータがありません',
  rowKey,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);

  // Vercel Best Practice: useEffectでのprop監視による状態リセットを避け、レンダーフェーズで派生状態をリセットする
  const [prevData, setPrevData] = useState(data);
  if (data !== prevData) {
    setPrevData(data);
    setCurrentPage(1);
  }

  const handleToggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null; // desc -> null (解除)
      }
      return { key, direction: 'asc' }; // 未ソート -> asc
    });
    setCurrentPage(1);
  };

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const colDef = columns.find((c) => c.key === sortConfig.key);
    if (!colDef) return data;

    return [...data].sort((a, b) => {
      const aVal = colDef.sortValue ? colDef.sortValue(a) : a[sortConfig.key as keyof T];
      const bVal = colDef.sortValue ? colDef.sortValue(b) : b[sortConfig.key as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      const comp = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comp : -comp;
    });
  }, [data, sortConfig, columns]);

  const totalCount = sortedData.length;
  const maxPage = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, maxPage);

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  const thClass = 'px-5 py-4 text-left align-middle font-bold whitespace-nowrap text-gray-900';
  const tdClass = 'px-5 py-4 align-middle whitespace-nowrap text-gray-900';

  return (
    <>
      <div className="overflow-x-auto border border-solid-gray-420">
        <table className="w-full table-auto text-std-16N-170 bg-white text-sm">
          <thead>
            <tr className="border-b border-black bg-solid-gray-100">
              {columns.map((col) => {
                if (col.sortable) {
                  const direction = sortConfig?.key === col.key ? sortConfig.direction : null;
                  return (
                    <th key={col.key} className={`${thClass} ${col.className ?? ''}`}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-1 text-start underline underline-offset-2 hover:decoration-2 focus-visible:rounded-sm focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:bg-yellow-300"
                        onClick={() => handleToggleSort(col.key)}
                        aria-sort={
                          direction === 'asc'
                            ? 'ascending'
                            : direction === 'desc'
                            ? 'descending'
                            : 'none'
                        }
                      >
                        {col.label}
                        <SortIcon direction={direction} />
                      </button>
                    </th>
                  );
                }
                return (
                  <th key={col.key} className={`${thClass} ${col.className ?? ''}`}>
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row, idx) => {
                const globalIndex = (safePage - 1) * pageSize + idx;
                return (
                  <tr
                    key={rowKey(row)}
                    className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors last:border-b-0"
                  >
                    {columns.map((col) => {
                      const content = col.render
                        ? col.render(row, globalIndex)
                        : String(row[col.key as keyof T] ?? '');
                      return (
                        <td key={col.key} className={`${tdClass} ${col.className ?? ''}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <span>表示件数</span>
          {pageSizeOptions.map((size, i) => (
            <React.Fragment key={size}>
              {i > 0 && <span className="text-gray-400">|</span>}
              <button
                type="button"
                className={`px-1 underline underline-offset-2 hover:no-underline ${
                  pageSize === size ? 'font-bold text-gray-900 no-underline' : 'text-[#0017C1]'
                }`}
                onClick={() => handlePageSizeChange(size)}
                aria-pressed={pageSize === size}
              >
                {size}件
              </button>
            </React.Fragment>
          ))}
        </div>

        {maxPage > 1 && (
          <Pagination>
            <PaginationFirst
              href="#"
              onClick={(e) => handlePageChange(e, 1)}
              aria-disabled={safePage === 1}
              className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
            <PaginationPrev
              href="#"
              onClick={(e) => handlePageChange(e, safePage - 1)}
              aria-disabled={safePage === 1}
              className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
            <PaginationCurrent current={safePage} max={maxPage} />
            <PaginationNext
              href="#"
              onClick={(e) => handlePageChange(e, safePage + 1)}
              aria-disabled={safePage === maxPage}
              className={safePage === maxPage ? 'pointer-events-none opacity-50' : ''}
            />
            <PaginationLast
              href="#"
              onClick={(e) => handlePageChange(e, maxPage)}
              aria-disabled={safePage === maxPage}
              className={safePage === maxPage ? 'pointer-events-none opacity-50' : ''}
            />
          </Pagination>
        )}
      </div>
    </>
  );
}
