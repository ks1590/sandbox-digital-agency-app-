import { EXAMINATION_MOCK_DATA } from "../metadata/api";
import {
  DATA_PROFILE_PERIOD_END,
  DATA_PROFILE_PERIOD_START,
} from "./constants";
import type { DataProfileResponse, DataProfileRow } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function generateMockRows(): DataProfileRow[] {
  return EXAMINATION_MOCK_DATA.map((col, i) => ({
    id: i + 1,
    logicalName: col.logicalName,
    physicalName: col.physicalName,
    maxLength: 10,
    avgLength: 10,
    distinctCount: 100,
    maxValue: 99999,
    minValue: 1,
    validRatio: "99.8%",
    invalidRatio: "0.1%",
    nullRatio: "0.1%",
  }));
}

// データ種別ごとのモックデータ。APIが未接続の場合に使用する
export const MOCK_DATA_BY_TYPE: Record<string, DataProfileResponse> = {
  clinical: {
    periodFrom: DATA_PROFILE_PERIOD_START,
    periodTo: DATA_PROFILE_PERIOD_END,
    totalRows: 500,
    totalFiles: 100,
    categories: [
      {
        categoryId: "disease",
        label: "傷病名",
        rows: generateMockRows(),
      },
      {
        categoryId: "allergy",
        label: "薬剤・その他アレルギー等",
        rows: generateMockRows(),
      },
      {
        categoryId: "examination",
        label: "感染症・検査",
        rows: generateMockRows(),
      },
    ],
  },
  receipt: {
    periodFrom: DATA_PROFILE_PERIOD_START,
    periodTo: DATA_PROFILE_PERIOD_END,
    totalRows: 1200,
    totalFiles: 240,
    categories: [
      {
        categoryId: "medical_receipt",
        label: "医科レセプト",
        rows: generateMockRows(),
      },
      {
        categoryId: "dpc_receipt",
        label: "DPCレセプト",
        rows: generateMockRows(),
      },
      {
        categoryId: "pharmacy_receipt",
        label: "調剤レセプト",
        rows: generateMockRows(),
      },
    ],
  },
  dpc: {
    periodFrom: DATA_PROFILE_PERIOD_START,
    periodTo: DATA_PROFILE_PERIOD_END,
    totalRows: 850,
    totalFiles: 160,
    categories: [
      {
        categoryId: "format1",
        label: "様式1",
        rows: generateMockRows(),
      },
      {
        categoryId: "ef_integrated",
        label: "EF統合ファイル",
        rows: generateMockRows(),
      },
      {
        categoryId: "d_file",
        label: "Dファイル",
        rows: generateMockRows(),
      },
    ],
  },
  checkup: {
    periodFrom: DATA_PROFILE_PERIOD_START,
    periodTo: DATA_PROFILE_PERIOD_END,
    totalRows: 350,
    totalFiles: 70,
    categories: [
      {
        categoryId: "questionnaire",
        label: "基本問診",
        rows: generateMockRows(),
      },
      {
        categoryId: "body_measurement",
        label: "身体測定・血圧",
        rows: generateMockRows(),
      },
      {
        categoryId: "lab_test",
        label: "血液・尿検査",
        rows: generateMockRows(),
      },
    ],
  },
};

// デフォルトのモックデータ（臨床情報）
export const MOCK_DATA: DataProfileResponse = MOCK_DATA_BY_TYPE.clinical;

export async function fetchDataProfile(
  dataType?: string,
): Promise<DataProfileResponse> {
  const selectedType = dataType || "clinical";

  if (API_BASE_URL) {
    try {
      const url = dataType
        ? `${API_BASE_URL}/data-profile?type=${encodeURIComponent(dataType)}`
        : `${API_BASE_URL}/data-profile`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API エラー: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "API からのデータ取得に失敗しました。モックデータを使用します:",
        error,
      );
      return MOCK_DATA_BY_TYPE[selectedType] || MOCK_DATA;
    }
  }

  console.info(
    "NEXT_PUBLIC_API_BASE_URL が未設定のため、モックデータを使用します。",
  );
  return MOCK_DATA_BY_TYPE[selectedType] || MOCK_DATA;
}


