"use client";

import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/form/DatePicker";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
} from "@/components/ui/ModalDialog";
import { getColumns } from "./columns";
import type { ExtractionRequest } from "./types";
import { formatJsonSafe } from "./utils";

export default function ExtractionStatusContent({
  data: allData,
}: {
  data: ExtractionRequest[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialYear = searchParams.get("year") || "";
  const initialMonth = searchParams.get("month") || "";

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalState, setModalState] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const hasSearched = initialYear !== "" || initialMonth !== "";

  const displayData = useMemo(() => {
    if (!hasSearched) return [];
    let result = allData;
    if (initialYear) {
      result = result.filter((req) => {
        const d = dayjs(req.receptionTimestamp);
        return d.isValid() && d.year() === Number(initialYear);
      });
    }
    if (initialMonth) {
      result = result.filter((req) => {
        const d = dayjs(req.receptionTimestamp);
        // dayjs の month() は 0-indexed (0=1月) なので +1 して比較する
        return d.isValid() && d.month() + 1 === Number(initialMonth);
      });
    }
    return result;
  }, [allData, hasSearched, initialYear, initialMonth]);

  const [yearInput, setYearInput] = useState(initialYear);
  const [monthInput, setMonthInput] = useState(initialMonth);

  useEffect(() => {
    setYearInput(initialYear);
    setMonthInput(initialMonth);
  }, [initialYear, initialMonth]);

  const handleOpenModal = useCallback((title: string, content: string) => {
    setModalState({ title, content });
    dialogRef.current?.showModal();
  }, []);

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setModalState(null);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (yearInput) params.set("year", yearInput);
    if (monthInput) params.set("month", monthInput);

    // URLのクエリパラメータを更新することでServer Componentに再フェッチさせる
    router.push(`?${params.toString()}`);
  };

  const columns = useMemo(() => getColumns(handleOpenModal), [handleOpenModal]);

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
            {hasSearched && displayData.length === 0 && (
              <span className="text-red-600 text-sm font-bold ml-2">
                該当データがありません。
              </span>
            )}
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
        <ModalDialogContent
          className={`!w-[40vw] !max-w-none ${
            modalState?.title === "エラー内容" ? "!h-[45vh]" : "!h-[90vh]"
          }`}
        >
          <ModalDialogHeader className="border-none px-6 pt-5 pb-2 shrink-0">
            <ModalDialogHeading
              id="info-modal-title"
              className="text-base font-bold text-gray-900"
            >
              {modalState?.title || "情報"}
            </ModalDialogHeading>
          </ModalDialogHeader>
          <ModalDialogBody className="px-6 py-0 flex-1 flex flex-col min-h-0">
            <div className="bg-gray-100 rounded-lg p-5 flex-1 min-h-0 overflow-y-auto">
              {modalState?.content ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all font-sans">
                  {formatJsonSafe(modalState.content)}
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
