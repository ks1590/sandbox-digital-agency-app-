'use client';

import React, { useState, useRef, useMemo, type ReactNode } from 'react';
import { Button } from '../../components/ui/Button';
import {
  ModalDialog,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
  ModalDialogBody,
  ModalDialogActions,
} from '../../components/ui/ModalDialog';
import {
  DatePicker,
  DatePickerYear,
  DatePickerMonth,
} from '../../components/form/DatePicker';
import {
  Pagination,
  PaginationCurrent,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '../../components/ui/Pagination';
import rawData from './data.json';

// =========================================
// 型定義
// =========================================

/** データ行の型定義 */
interface ExtractionRequest {
  requestId: string;
  receptionId: string;
  dataCategory: string;
  extractionDataInfo: string;
  extractionStatus: string;
  receptionTimestamp: string;
  receptionStatus: string;
  completionTimestamp: string;
  resultStatus: string;
  processingTime: string;
  processingTimeSeconds: number;
}

/** テーブルカラム定義 */
interface ColumnDef {
  key: string;
  label: string;
  /** ソート可能かどうか */
  sortable?: boolean;
  /** カスタムレンダリング。未指定の場合はフィールド値をそのまま表示 */
  render?: (row: ExtractionRequest, rowIndex: number) => ReactNode;
}

// =========================================
// ヘルパー関数（コンポーネント外に定義して再生成を防ぐ）
// =========================================

/** ISO日付文字列をyyyy-mm-dd HH:MM形式にフォーマット */
function formatTimestamp(isoStr: string): string {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${day} ${h}:${min}`;
}

/** 抽出データ情報JSONを省略表示 */
function truncateInfo(json: string): string {
  try {
    const parsed = JSON.parse(json);
    const entries = Object.entries(parsed);
    if (entries.length === 0) return json;
    const [firstKey, firstVal] = entries[0];
    return `..."${firstKey}": ${JSON.stringify(firstVal)}...`;
  } catch {
    return json.length > 40 ? json.slice(0, 40) + '...' : json;
  }
}

/** JSON文字列を整形して返す（パース失敗時はそのまま返す） */
function formatJsonSafe(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

// =========================================
// サブコンポーネント
// =========================================

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
          {/* ソート済みアイコン */}
          <path d="M13 15.12L16.27 12L17 12.7L12.5 17L8 12.7L8.73 12L12 15.12V4H13V15.12Z" />
          <path d="M10 7.92L8.73 9L7 7.52V16H5V7.52L3.27 9L2 7.93L5.5 4L10 7.93Z" />
        </>
      ) : (
        <>
          {/* 未ソートアイコン */}
          <path d="M13 15.12L16.27 12L17 12.7L12.5 17L8 12.7L8.73 12L12 15.12V4H13V15.12Z" />
          <path d="M7 4.88L10.27 8L11 7.3L6.5 3L2 7.3L2.73 8L6 4.88V17H7V4.88Z" />
        </>
      )}
    </svg>
  );
}

// =========================================
// メインコンポーネント
// =========================================

export default function ExtractionStatusContent() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  // 検索用ステート
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [filteredData, setFilteredData] = useState<ExtractionRequest[]>(rawData.requests);

  // ソートステート（処理時間のみ）
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // ページネーションステート
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  // -------------------------
  // イベントハンドラ
  // -------------------------

  const handleOpenModal = (info: string) => {
    setSelectedInfo(info);
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setSelectedInfo(null);
  };

  const handleSearch = () => {
    let result: ExtractionRequest[] = rawData.requests;
    if (yearInput) {
      result = result.filter((d) => d.receptionTimestamp.startsWith(yearInput));
    }
    if (monthInput) {
      const mm = monthInput.padStart(2, '0');
      result = result.filter((d) => d.receptionTimestamp.substring(5, 7) === mm);
    }
    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setYearInput('');
    setMonthInput('');
    setFilteredData(rawData.requests);
    setCurrentPage(1);
    setSortDirection(null);
  };

  const handleToggleSort = () => {
    setSortDirection((prev) =>
      prev === null ? 'asc' : prev === 'asc' ? 'desc' : null
    );
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

  // -------------------------
  // 算出値
  // -------------------------

  /** ソート適用後データ */
  const sortedData = useMemo(() => {
    if (!sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const diff = a.processingTimeSeconds - b.processingTimeSeconds;
      return sortDirection === 'asc' ? diff : -diff;
    });
  }, [filteredData, sortDirection]);

  const totalCount = sortedData.length;
  const maxPage = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, maxPage);

  /** ページ切り出し */
  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  // -------------------------
  // カラム定義（データ駆動でヘッダーとボディを生成）
  // -------------------------

  const columns: ColumnDef[] = useMemo(() => [
    {
      key: 'rowNumber',
      label: '項番',
      render: (_row, idx) => (safePage - 1) * pageSize + idx + 1,
    },
    { key: 'requestId', label: '抽出リクエストID' },
    { key: 'receptionId', label: '抽出リクエスト受付ID' },
    { key: 'dataCategory', label: 'データ分類' },
    {
      key: 'extractionDataInfo',
      label: '抽出データ情報',
      render: (row) => (
        <button
          type="button"
          className="text-[#0017C1] underline hover:no-underline text-left"
          onClick={() => handleOpenModal(row.extractionDataInfo)}
        >
          {truncateInfo(row.extractionDataInfo)}
        </button>
      ),
    },
    { key: 'extractionStatus', label: '抽出ステータス' },
    {
      key: 'receptionTimestamp',
      label: '受付時タイムスタンプ',
      render: (row) => formatTimestamp(row.receptionTimestamp),
    },
    { key: 'receptionStatus', label: '受付ステータス' },
    {
      key: 'completionTimestamp',
      label: '抽出処理完了時タイムスタンプ',
      render: (row) => formatTimestamp(row.completionTimestamp),
    },
    { key: 'resultStatus', label: '抽出結果ステータス' },
    {
      key: 'processingTime',
      label: '処理時間',
      sortable: true,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [safePage, pageSize]);

  // -------------------------
  // 共通CSSクラス
  // -------------------------

  const thClass = 'border-r border-solid-gray-500 px-3 py-3 text-left align-top whitespace-nowrap';
  const thLastClass = 'px-3 py-3 text-left align-top whitespace-nowrap';
  const tdClass = 'border-r border-solid-gray-420 px-3 py-3 align-top whitespace-nowrap';
  const tdLastClass = 'px-3 py-3 align-top whitespace-nowrap';

  // -------------------------
  // レンダリング
  // -------------------------

  return (
    <>
      <section className="mb-8">
        {/* 検索エリア */}
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-900 mb-2">受付年月</p>
          <div className="flex items-center gap-2">
            <DatePicker>
              {({ yearRef, monthRef }) => (
                <>
                  <DatePickerYear
                    ref={yearRef}
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                  />
                  <DatePickerMonth
                    ref={monthRef}
                    value={monthInput}
                    onChange={(e) => setMonthInput(e.target.value)}
                  />
                </>
              )}
            </DatePicker>
            <Button onClick={handleSearch} size="md" variant="solid-fill">
              検索
            </Button>
          </div>
        </div>

        {/* 総件数 */}
        <p className="text-sm text-gray-700 mb-2">総件数：{totalCount}件</p>

        {/* テーブル */}
        <div className="overflow-x-auto border border-solid-gray-420">
          <table className="w-full table-auto text-std-16N-170 bg-white text-sm">
            <thead>
              <tr className="border-b-2 border-black bg-solid-gray-100">
                {columns.map((col, i) => {
                  const isLast = i === columns.length - 1;
                  if (col.sortable) {
                    return (
                      <th key={col.key} className={isLast ? thLastClass : thClass}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-1 text-start underline underline-offset-2 hover:decoration-2 focus-visible:rounded focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:bg-yellow-300"
                          onClick={handleToggleSort}
                          aria-sort={
                            sortDirection === 'asc'
                              ? 'ascending'
                              : sortDirection === 'desc'
                              ? 'descending'
                              : 'none'
                          }
                        >
                          {col.label}
                          <SortIcon direction={sortDirection} />
                        </button>
                      </th>
                    );
                  }
                  return (
                    <th key={col.key} className={isLast ? thLastClass : thClass}>
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    該当するデータがありません
                  </td>
                </tr>
              ) : (
                pagedData.map((row, idx) => (
                  <tr
                    key={row.requestId}
                    className="border-b border-solid-gray-500 hover:bg-key-50 transition-colors last:border-b-0"
                  >
                    {columns.map((col, colIdx) => {
                      const isLast = colIdx === columns.length - 1;
                      const content = col.render
                        ? col.render(row, idx)
                        : String(row[col.key as keyof ExtractionRequest] ?? '');
                      return (
                        <td
                          key={col.key}
                          className={isLast ? tdLastClass : tdClass}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* テーブル下部：表示件数とページネーション */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          {/* 表示件数切り替え */}
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

          {/* ページネーション */}
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
      </section>

      {/* 抽出データ情報表示用のモーダル */}
      <ModalDialog ref={dialogRef} aria-labelledby="info-modal-title">
        <ModalDialogContent>
          <ModalDialogHeader>
            <ModalDialogHeading id="info-modal-title">
              抽出データ情報
            </ModalDialogHeading>
          </ModalDialogHeader>
          <ModalDialogBody>
            {selectedInfo ? (
              <pre className="text-sm bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">
                {formatJsonSafe(selectedInfo)}
              </pre>
            ) : (
              <p>情報が設定されていません</p>
            )}
          </ModalDialogBody>
          <ModalDialogActions className="flex justify-end">
            <Button onClick={handleCloseModal} size="lg" variant="solid-fill">
              OK
            </Button>
          </ModalDialogActions>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
}
