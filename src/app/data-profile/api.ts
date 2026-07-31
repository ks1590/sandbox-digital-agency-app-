import { EXAMINATION_MOCK_DATA } from "../metadata/api";
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

// モックデータ。APIが未接続の場合に使用する
export const MOCK_DATA: DataProfileResponse = {
  periodFrom: "2026年4月",
  periodTo: "2026年6月",
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
};
export async function fetchDataProfile(): Promise<DataProfileResponse> {
  if (API_BASE_URL) {
    try {
      const url = `${API_BASE_URL}/data-profile`;

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
      return MOCK_DATA;
    }
  }

  console.info(
    "NEXT_PUBLIC_API_BASE_URL が未設定のため、モックデータを使用します。",
  );
  return MOCK_DATA;
}
