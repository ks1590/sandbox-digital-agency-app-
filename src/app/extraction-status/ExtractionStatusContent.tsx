"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  DatePickerMonth,
  DatePickerYear,
} from "../../components/form/DatePicker";
import { Button } from "../../components/ui/Button";
import {
  type ColumnDef,
  DataTable,
} from "../../components/ui/DataTable/DataTable";
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
} from "../../components/ui/ModalDialog";
import type { ExtractionRequest } from "./types";
import { useExtractionStatus } from "./useExtractionStatus";

function formatTimestamp(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${min}`;
}

function truncateInfo(json: string): string {
  try {
    const parsed = JSON.parse(json);
    const entries = Object.entries(parsed);
    if (entries.length === 0) return json;
    const [firstKey, firstVal] = entries[0];
    return `..."${firstKey}": ${JSON.stringify(firstVal)}...`;
  } catch {
    return json.length > 40 ? `${json.slice(0, 40)}...` : json;
  }
}

function formatJsonSafe(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

export default function ExtractionStatusContent() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const [yearInput, setYearInput] = useState("");
  const [monthInput, setMonthInput] = useState("");

  // APIからデータを取得するカスタムフック
  const { data: filteredData, isLoading, error, search } = useExtractionStatus();

  const handleOpenModal = useCallback((info: string) => {
    setSelectedInfo(info);
    dialogRef.current?.showModal();
  }, []);

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setSelectedInfo(null);
  };

  const handleSearch = () => {
    search({
      year: yearInput || undefined,
      month: monthInput || undefined,
    });
  };

  const columns: ColumnDef<ExtractionRequest>[] = useMemo(
    () => [
      {
        key: "rowNumber",
        label: "項番",
        render: (_row, idx) => idx + 1,
      },
      { key: "requestId", label: "抽出リクエストID" },
      { key: "receptionId", label: "抽出リクエスト受付ID" },
      { key: "dataCategory", label: "データ分類" },
      {
        key: "extractionDataInfo",
        label: "抽出データ情報",
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
      { key: "extractionStatus", label: "抽出ステータス" },
      {
        key: "receptionTimestamp",
        label: "受付時タイムスタンプ",
        render: (row) => formatTimestamp(row.receptionTimestamp),
      },
      { key: "receptionStatus", label: "受付ステータス" },
      {
        key: "completionTimestamp",
        label: "抽出処理完了時タイムスタンプ",
        render: (row) => formatTimestamp(row.completionTimestamp),
      },
      { key: "resultStatus", label: "抽出結果ステータス" },
      {
        key: "processingTime",
        label: "処理時間",
        sortable: true,
        sortValue: (row) => row.processingTimeSeconds,
      },
    ],
    [handleOpenModal],
  );

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

        {/* エラー表示 */}
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-bold">データ取得エラー</p>
            <p>{error}</p>
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">データを読み込み中...</p>
          </div>
        ) : (
          <>
            {/* 総件数 */}
            <p className="text-sm text-gray-700 mb-2">
              総件数：{filteredData.length}件
            </p>

            {/* テーブル */}
            <DataTable
              data={filteredData}
              columns={columns}
              rowKey={(row) => row.requestId}
            />
          </>
        )}
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
              <pre className="text-sm bg-gray-50 border border-gray-200 rounded-sm p-3 overflow-x-auto whitespace-pre-wrap break-all">
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
