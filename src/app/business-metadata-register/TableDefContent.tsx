'use client';

import React, { useState } from 'react';
import Tab from '../../components/ui/Tab';
import { Input } from '../../components/form/Input';
import {
  Pagination,
  PaginationCurrent,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '../../components/ui/Pagination';

// ダミーデータ定義
interface TableDefRow {
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

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

const DUMMY_DATA: TableDefRow[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  physicalName: 'sample',
  dataType: 'VARCHAR',
  length: 100,
  required: '必須',
  logicalName: 'サンプル',
  description: 'これはデザインの見本',
  foreignKey: 'キー',
  masterType: '',
  sampleData: '',
}));

function TableDefGrid() {
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
    <div>
      <div className="overflow-x-auto border border-solid-gray-420 mt-4">
        <table className="w-full table-auto text-std-16N-170 bg-white text-sm">
          <thead>
            <tr className="border-b border-black bg-solid-gray-100">
              <th className={thClass}>項番</th>
              <th className={thClass}>物理名</th>
              <th className={thClass}>データ型</th>
              <th className={thClass}>桁数</th>
              <th className={thClass}>必須/任意</th>
              <th className={thClass}>論理名</th>
              <th className={thClass}>項目説明</th>
              <th className={thClass}>外部キー</th>
              <th className={thClass}>マスタ種別</th>
              <th className={thClass}>サンプルデータ</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors last:border-b-0"
              >
                <td className={tdClass}>{row.id}</td>
                <td className={tdClass}>{row.physicalName}</td>
                <td className={tdClass}>{row.dataType}</td>
                <td className={tdClass}>{row.length}</td>
                <td className={tdClass}>{row.required}</td>
                <td className={tdClass}>
                  <Input
                    blockSize="md"
                    defaultValue={row.logicalName}
                    placeholder="入力テキスト"
                    className="min-w-[120px]"
                    aria-label={`論理名（項番${row.id}）`}
                  />
                </td>
                <td className={tdClass}>
                  <Input
                    blockSize="md"
                    defaultValue={row.description}
                    placeholder="入力テキスト"
                    className="min-w-[200px]"
                    aria-label={`項目説明（項番${row.id}）`}
                  />
                </td>
                <td className={tdClass}>
                  <Input
                    blockSize="md"
                    defaultValue={row.foreignKey}
                    placeholder="入力テキスト"
                    className="min-w-[120px]"
                    aria-label={`外部キー（項番${row.id}）`}
                  />
                </td>
                <td className={tdClass}>
                  <Input
                    blockSize="md"
                    defaultValue={row.masterType}
                    placeholder="入力テキスト"
                    className="min-w-[120px]"
                    aria-label={`マスタ種別（項番${row.id}）`}
                  />
                </td>
                <td className={tdClass}>
                  <Input
                    blockSize="md"
                    defaultValue={row.sampleData}
                    placeholder="入力テキスト"
                    className="min-w-[120px]"
                    aria-label={`サンプルデータ（項番${row.id}）`}
                  />
                </td>
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

export default function TableDefContent() {
  return (
    <div className="py-6">
      {/* 上部情報 */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-2">データ種別</h3>
        <p className="text-base text-gray-900">臨床情報</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">テーブル定義</h3>
      </div>

      {/* サブタブ */}
      <Tab
        headingId="table-def-sub-tabs-heading"
        items={[
          {
            label: '傷病',
            id: 'sub-tab-shoubyou',
            content: <TableDefGrid />,
          },
          {
            label: '薬剤・その他アレルギー等',
            id: 'sub-tab-yakuzai',
            content: <TableDefGrid />,
          },
          {
            label: '感染症・検査',
            id: 'sub-tab-kansen',
            content: <TableDefGrid />,
          },
        ]}
      />
    </div>
  );
}
