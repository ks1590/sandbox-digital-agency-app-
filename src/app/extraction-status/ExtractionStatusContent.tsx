"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/form/DatePicker";
import { Button } from "@/components/ui/Button";
import { type ColumnDef, DataTable } from "@/components/ui/DataTable/DataTable";
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
} from "@/components/ui/ModalDialog";
import type { ExtractionRequest } from "./types";

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

export default function ExtractionStatusContent({
  data: filteredData,
  initialYear,
  initialMonth,
}: {
  data: ExtractionRequest[];
  initialYear?: string;
  initialMonth?: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const hasSearched = initialYear !== undefined || initialMonth !== undefined;
  const displayData = hasSearched ? filteredData : [];

  const [yearInput, setYearInput] = useState(initialYear || "");
  const [monthInput, setMonthInput] = useState(initialMonth || "");

  const handleOpenModal = useCallback((info: string) => {
    setSelectedInfo(info);
    dialogRef.current?.showModal();
  }, []);

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setSelectedInfo(null);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (yearInput) params.set("year", yearInput);
    if (monthInput) params.set("month", monthInput);

    // URLのクエリパラメータを更新することでServer Componentに再フェッチさせる
    router.push(`?${params.toString()}`);
  };

  const columns: ColumnDef<ExtractionRequest>[] = useMemo(
    () => [
      {
        key: "rowNumber",
        label: "項番",
        render: (_row, idx) => idx + 1,
      },
      { key: "requestId", label: "抽出リクエストID" },
      {
        key: "receptionId",
        label: (
          <>
            抽出リクエスト
            <br />
            受付ID
          </>
        ),
      },
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
      {
        key: "extractionStatus",
        label: (
          <>
            抽出
            <br />
            ステータス
          </>
        ),
      },
      {
        key: "receptionTimestamp",
        label: (
          <>
            受付時
            <br />
            タイムスタンプ
          </>
        ),
        render: (row) => formatTimestamp(row.receptionTimestamp),
      },
      {
        key: "receptionStatus",
        label: (
          <>
            受付
            <br />
            ステータス
          </>
        ),
      },
      {
        key: "completionTimestamp",
        label: (
          <>
            抽出処理完了時
            <br />
            タイムスタンプ
          </>
        ),
        render: (row) => formatTimestamp(row.completionTimestamp),
      },
      {
        key: "resultStatus",
        label: (
          <>
            抽出結果
            <br />
            ステータス
          </>
        ),
      },
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
                    placeholder="YYYY"
                  />
                  <DatePickerMonth
                    ref={monthRef}
                    value={monthInput}
                    onChange={(e) => setMonthInput(e.target.value)}
                    placeholder="M"
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
        <p className="text-sm text-gray-700 mb-2">
          総件数：{displayData.length}件
        </p>

        {/* テーブル */}
        <DataTable
          data={displayData}
          columns={columns}
          rowKey={(row) => row.requestId}
        />
      </section>

      {/* 抽出データ情報表示用のモーダル */}
      <ModalDialog
        ref={dialogRef}
        aria-labelledby="info-modal-title"
        className="m-auto"
      >
        <ModalDialogContent className="!w-[40vw] !max-w-none !h-[90vh]">
          <ModalDialogHeader className="border-none px-6 pt-5 pb-2 shrink-0">
            <ModalDialogHeading
              id="info-modal-title"
              className="text-base font-bold text-gray-900"
            >
              抽出データ情報
            </ModalDialogHeading>
          </ModalDialogHeader>
          <ModalDialogBody className="px-6 py-0 flex-1 flex flex-col min-h-0">
            <div className="bg-gray-100 rounded-lg p-5 flex-1 min-h-0 overflow-y-auto">
              {selectedInfo ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all font-sans">
                  {formatJsonSafe(selectedInfo)}
                </pre>
              ) : (
                <p className="text-sm text-gray-700">
                  情報が設定されていません
                </p>
              )}
            </div>
          </ModalDialogBody>
          <ModalDialogActions className="border-none bg-white px-6 pt-4 pb-5 flex justify-end shrink-0">
            <Button onClick={handleCloseModal} size="md" variant="outline">
              閉じる
            </Button>
          </ModalDialogActions>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
}
