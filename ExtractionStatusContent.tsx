"use client";

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
import { filterByYearMonth, formatJsonSafe } from "./utils";

export default function ExtractionStatusContent({
  data: allData,
  statusMessage,
}: {
  data: ExtractionRequest[];
  statusMessage?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = useMemo(() => new Date(), []);
  const defaultYear = String(today.getFullYear());
  const defaultMonth = String(today.getMonth() + 1);

  const searchYear = searchParams.get("year");
  const searchMonth = searchParams.get("month");
  const hasExplicitSearch = searchYear !== null || searchMonth !== null;

  const initialYear = hasExplicitSearch ? (searchYear ?? "") : defaultYear;
  const initialMonth = hasExplicitSearch ? (searchMonth ?? "") : defaultMonth;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalState, setModalState] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const hasSearched = initialYear !== "" || initialMonth !== "";

  const displayData = useMemo(
    () => filterByYearMonth(allData, initialYear, initialMonth),
    [allData, initialYear, initialMonth],
  );

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

    router.push(`?${params.toString()}`);
  };

  const columns = useMemo(() => getColumns(handleOpenModal), [handleOpenModal]);
  const inlineMessage = statusMessage
    ?? (hasSearched && displayData.length === 0
      ? "該当データがありません。"
      : null);
  const isLoadingMessage = statusMessage !== null && statusMessage !== undefined;

  return (
    <>
      <section className="mb-8">
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
            {inlineMessage && (
              <span
                className={`text-sm font-bold ml-2 ${isLoadingMessage ? "text-gray-900" : "text-red-600"
                  }`}
              >
                {inlineMessage}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-2">
          総件数：{displayData.length}件
        </p>

        <DataTable
          data={displayData}
          columns={columns}
          rowKey={(row) => `${row.requestId}-${row.receptionId}`}
        />
      </section>

      <ModalDialog
        ref={dialogRef}
        aria-labelledby="info-modal-title"
        className="m-auto"
      >
        <ModalDialogContent
          className={`!w-[40vw] !max-w-none ${modalState?.title === "エラー内容" ? "!h-[45vh]" : "!h-[90vh]"
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
