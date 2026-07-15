import type { ColumnDef } from "@/components/ui/DataTable/DataTable";
import type { ExtractionRequest } from "./types";
import { formatTimestamp, truncateInfo } from "./utils";

export const getColumns = (
  handleOpenModal: (title: string, content: string) => void,
): ColumnDef<ExtractionRequest>[] => [
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
        onClick={() =>
          handleOpenModal("抽出データ情報", row.extractionDataInfo)
        }
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
    render: (row) => {
      if (row.resultStatus === "異常終了" || row.resultStatus === "エラー") {
        if (row.errorMessage) {
          return (
            <button
              type="button"
              className="text-[#0017C1] underline hover:no-underline text-left"
              onClick={() => handleOpenModal("エラー内容", row.errorMessage!)}
            >
              エラー
            </button>
          );
        }
        return <span className="text-red-600">エラー</span>;
      }
      return row.resultStatus;
    },
  },
  {
    key: "processingTime",
    label: "処理時間",
    sortable: true,
    sortValue: (row) => row.processingTimeSeconds,
  },
];
