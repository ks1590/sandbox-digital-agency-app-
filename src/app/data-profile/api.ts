import type { DataProfileResponse, DataProfileRow } from "./types";

/**
 * APIのベースURL
 * 本番APIが利用可能になったら環境変数 NEXT_PUBLIC_API_BASE_URL に設定する。
 * 未設定の場合はモックデータにフォールバックする。
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * モック用のダミー行データを生成する
 */
function generateMockRows(count: number): DataProfileRow[] {
  return Array.from({ length: count }).map((_, i) => ({
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
}

/**
 * モックデータ
 * APIが未接続の場合に使用する
 */
const MOCK_DATA: DataProfileResponse = {
  periodFrom: "2026年4月",
  periodTo: "2026年6月",
  totalRows: 500,
  totalFiles: 100,
  categories: [
    {
      categoryId: "disease",
      label: "傷病名",
      rows: generateMockRows(120),
    },
    {
      categoryId: "allergy",
      label: "薬剤・その他アレルギー等",
      rows: generateMockRows(120),
    },
    {
      categoryId: "examination",
      label: "感染症・検査",
      rows: generateMockRows(120),
    },
  ],
};

/**
 * データプロファイル情報を取得する
 *
 * APIが利用可能な場合はAPIから取得し、
 * 利用不可の場合はローカルのモックデータにフォールバックする。
 *
 * @returns データプロファイルのレスポンス
 */
export async function fetchDataProfile(): Promise<DataProfileResponse> {
  // API URLが設定されている場合はAPIから取得を試みる
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
      // APIエラー時はモックデータにフォールバック
      return MOCK_DATA;
    }
  }

  // API URLが未設定の場合はモックデータを返す
  console.info(
    "NEXT_PUBLIC_API_BASE_URL が未設定のため、モックデータを使用します。",
  );
  return MOCK_DATA;
}
