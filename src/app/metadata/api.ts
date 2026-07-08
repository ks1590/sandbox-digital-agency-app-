import type { MetadataResponse, TableDefRow } from "./types";

/**
 * APIのベースURL
 * 本番APIが利用可能になったら環境変数 NEXT_PUBLIC_API_BASE_URL に設定する。
 * 未設定の場合はモックデータにフォールバックする。
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * モック用のテーブル定義ダミー行データを生成する
 */
function generateMockTableDefRows(count: number): TableDefRow[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    physicalName: "sample",
    dataType: "VARCHAR",
    length: 100,
    required: "必須",
    logicalName: "サンプル",
    description: "これはデザインの見本",
    foreignKey: "キー",
    masterType: "",
    sampleData: "",
  }));
}

/**
 * モックデータ
 * APIが未接続の場合に使用する
 */
const MOCK_DATA: MetadataResponse = {
  overview: {
    overviewText:
      "概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明",
    dataTypes: [{ id: "clinical", name: "臨床情報" }],
    startYear: "2020年",
    latestYear: "2026年",
    updateFrequencies: [
      { target: "項目名A", frequency: "年次" },
      { target: "項目名B", frequency: "月次" },
    ],
    tables: [
      {
        id: "table1",
        name: "〇〇テーブル",
        overview: "テーブル概要の説明...",
        unit: "レセプト",
      },
      {
        id: "table2",
        name: "△△テーブル",
        overview: "テーブル概要の説明...",
        unit: "レセプト",
      },
    ],
    notesText: "留意事項を入力...",
    keyInfoText: "",
  },
  tableDefs: {
    disease: generateMockTableDefRows(120),
    allergy: generateMockTableDefRows(120),
    examination: generateMockTableDefRows(120),
  },
};

/**
 * メタデータ情報を取得する
 *
 * APIが利用可能な場合はAPIから取得し、
 * 利用不可の場合はローカルのモックデータにフォールバックする。
 *
 * @returns メタデータのレスポンス
 */
export async function fetchMetadata(): Promise<MetadataResponse> {
  // API URLが設定されている場合はAPIから取得を試みる
  if (API_BASE_URL) {
    try {
      const url = `${API_BASE_URL}/metadata`;

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
