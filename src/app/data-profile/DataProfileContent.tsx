"use client";

import React, { useState } from "react";
import Tab from "../../components/ui/Tab";
import {
  Pagination,
  PaginationCurrent,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from "../../components/ui/Pagination";

interface DataProfileRow {
  id: number;
  columnName: string;
  maxLength: number;
  avgLength: number;
  distinctCount: number;
  maxValue: number;
  minValue: number;
  validRatio: string;
  invalidRatio: string;
  nullRatio: string;
}

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

const DUMMY_DATA: DataProfileRow[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  columnName: "sample",
  maxLength: 10,
  avgLength: 10,
  distinctCount: 100,
  maxValue: 99999,
  minValue: 1,
  validRatio: "99.8%",
  invalidRatio: "0.1%",
  nullRatio: "0.1%",
}));

function DataProfileGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  const totalCount = DUMMY_DATA.length;
  const maxPage = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, maxPage);

  const pagedData = DUMMY_DATA.slice(
    (safePage - 1) * pageSize,
    (safePage - 1) * pageSize + pageSize
  );

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const thClass = 'px-5 py-4 text-left align-middle font-bold whitespace-nowrap text-gray-900';
  const tdClass = 'px-5 py-4 align-middle whitespace-nowrap';

  return (
    <div className="py-6">
      <div className="flex gap-8 mb-4 text-base font-bold text-gray-900">
        <p>合計行数：500件</p>
        <p>合計ファイル数：100件</p>
      </div>

      <div className="overflow-x-auto border border-solid-gray-420">
        <table className="w-full table-auto text-std-16N-170 bg-white text-sm">
          <thead>
            <tr className="border-b border-black bg-solid-gray-100">
              <th className={thClass}>項番</th>
              <th className={thClass}>列の名前</th>
              <th className={thClass}>最大長</th>
              <th className={thClass}>平均長</th>
              <th className={thClass}>個別値の数</th>
              <th className={thClass}>最大値</th>
              <th className={thClass}>最小値</th>
              <th className={thClass}>有効値割合</th>
              <th className={thClass}>無効値割合</th>
              <th className={thClass}>null値割合</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors last:border-b-0"
              >
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>{row.columnName}</td>
                <td className={tdClass}>{row.maxLength}</td>
                <td className={tdClass}>{row.avgLength}</td>
                <td className={tdClass}>{row.distinctCount}</td>
                <td className={tdClass}>{row.maxValue}</td>
                <td className={tdClass}>{row.minValue}</td>
                <td className={tdClass}>{row.validRatio}</td>
                <td className={tdClass}>{row.invalidRatio}</td>
                <td className={tdClass}>{row.nullRatio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* テーブル下部：表示件数とページネーション */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <span>表示件数</span>
          {PAGE_SIZE_OPTIONS.map((size, i) => (
            <React.Fragment key={size}>
              {i > 0 && <span className="text-gray-400">|</span>}
              <button
                type="button"
                className={`px-1 underline underline-offset-2 hover:no-underline ${
                  pageSize === size
                    ? 'font-bold text-gray-900 no-underline'
                    : 'text-[#0017C1]'
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
    </div>
  );
}

export default function DataProfileContent() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-2">集計対象期間</h3>
        <p className="text-base text-gray-900 font-bold">
          2026年4月 <span className="mx-2 font-normal">から</span> 2026年6月
        </p>
      </div>

      <Tab
        headingId="data-profile-tabs-heading"
        items={[
          {
            label: "傷病名",
            id: "tab-disease",
            content: <DataProfileGrid />,
          },
          {
            label: "薬剤・その他アレルギー等",
            id: "tab-allergy",
            content: <DataProfileGrid />,
          },
          {
            label: "感染症・検査",
            id: "tab-examination",
            content: <DataProfileGrid />,
          },
        ]}
      />
    </>
  );
}
