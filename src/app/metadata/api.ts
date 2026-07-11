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
      "本データベースは、全国の医療機関から収集した患者の臨床情報（傷病履歴、アレルギー、検査結果等）を統合的に管理・提供するプラットフォームです。\n研究機関や医療政策の立案における基礎データとして活用されることを目的としています。",
    dataTypes: [{ id: "clinical", name: "臨床情報" }],
    startYear: "2020",
    latestYear: "2026",
    collectionFrequency: "年次",
    updateFrequencies: [
      { target: "傷病情報", frequency: "月次" },
      { target: "アレルギー情報", frequency: "月次" },
      { target: "検査結果", frequency: "日次" },
    ],
    tables: [
      {
        id: "disease",
        physicalName: "trn_disease",
        logicalName: "傷病テーブル",
        overview: "患者の傷病履歴を管理するテーブル。受診時の診断名やICD-10コード、発症日などを保持します。",
        unit: "患者",
      },
      {
        id: "allergy",
        physicalName: "trn_allergy",
        logicalName: "アレルギーテーブル",
        overview: "患者のアレルギー情報（薬剤アレルギー、食物アレルギー等）を管理するテーブル。アレルゲンや重症度などを保持します。",
        unit: "患者",
      },
      {
        id: "examination",
        physicalName: "trn_examination",
        logicalName: "検査結果テーブル",
        overview: "血液検査、尿検査などの各種検査結果を管理するテーブル。検査項目、基準値、結果値などを保持します。",
        unit: "検査項目",
      },
    ],
    notesText: "留意事項を入力...",
    keyInfoText: "",
    status: "draft",
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
