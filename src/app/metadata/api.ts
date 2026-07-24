import type { MetadataResponse, TableDefRow } from "./types";

/**
 * APIのベースURL
 * 本番APIが利用可能になったら環境変数 NEXT_PUBLIC_API_BASE_URL に設定する。
 * 未設定の場合はモックデータにフォールバックする。
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const EXAMINATION_MOCK_DATA: TableDefRow[] = [
  {
    id: 1,
    physicalName: "meta.profile",
    dataType: "string",
    length: "",
    required: "必須",
    logicalName: "プロファイル情報",
    description: "プロファイルのバージョン等",
    foreignKey: "いいえ",
    masterType: "",
    sampleData:
      "http://jpfhir.jp/fhir/clins/StructureDefinition/JP_Bundle_eCS_CLINS",
  },
  {
    id: 2,
    physicalName: "bdl_identifier",
    dataType: "string",
    length: "37",
    required: "必須",
    logicalName: "bundle識別子",
    description: "bundleの一意の識別子",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "1311234567^2024^0123-IDa-20240123-111111",
  },
  {
    id: 3,
    physicalName: "pt_identifier",
    dataType: "int",
    length: "9",
    required: "必須",
    logicalName: "被保険者個人識別子",
    description: "保険者情報と被保険者情報（個人に関する情報）",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "111222333",
  },
  {
    id: 4,
    physicalName: "active",
    dataType: "boolean",
    length: "",
    required: "必須",
    logicalName: "記録の状態",
    description: "この患者の記録が積極的に使用されているかどうか",
    foreignKey: "はい",
    masterType: "医療機関等マスタ",
    sampleData: "true",
  },
  {
    id: 5,
    physicalName: "gender",
    dataType: "string",
    length: "",
    required: "必須",
    logicalName: "性別",
    description: "性別を表記 (male | female | other | unknown)",
    foreignKey: "はい",
    masterType: "医療機関等マスタ",
    sampleData: "female",
  },
  {
    id: 6,
    physicalName: "birthdate",
    dataType: "string",
    length: "",
    required: "必須",
    logicalName: "生年月日",
    description: "個人の生年月日",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "2000/1/1",
  },
  {
    id: 7,
    physicalName: "ecs_institutionnumber",
    dataType: "string",
    length: "",
    required: "条件により必須",
    logicalName: "医療機関コード",
    description: "【電子カルテ情報共有サービス】医療機関コード（10桁）",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "1211234567",
  },
  {
    id: 8,
    physicalName: "clinicalstatus",
    dataType: "string",
    length: "",
    required: "条件により必須",
    logicalName: "臨床的状態",
    description:
      "病名最終日での状態（転帰）(active | recurrence | relapse | inactive | remission | resolved)",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "active",
  },
  {
    id: 9,
    physicalName: "verificationstatus",
    dataType: "string",
    length: "",
    required: "条件により必須",
    logicalName: "検証状況",
    description:
      "疑い病名フラグがない病名には、確認済み（確定病名：confirmed）を設定し、疑い病名には、未確認（疑い病名：unconfirmed）を設定する。",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "confirmed",
  },
  {
    id: 10,
    physicalName: "abatementdatetime",
    dataType: "string",
    length: "",
    required: "必須",
    logicalName: "病名終了日",
    description: "病名終了日や転帰日がある場合にのみ設定する",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "2010-01-01",
  },
];

/**
 * モックデータ
 * APIが未接続の場合に使用する
 */
const MOCK_DATA: MetadataResponse = {
  overview: {
    overviewText: "\n## データ説明情報\n- \n## キー情報\n- \n",
    dataTypes: [{ id: "clinical", name: "臨床情報" }],
    startYear: "2020",
    latestYear: "2026",
    collectionFrequency: "年次",
    updateFrequencies: [
      { target: "項目1", frequency: "月次" },
      { target: "項目2", frequency: "月次" },
      { target: "項目3", frequency: "日次" },
    ],
    tables: [
      {
        id: "disease",
        physicalName: "condtion_table",
        logicalName: "傷病",
        overview:
          "患者の傷病履歴を管理するテーブル。受診時の診断名やICD-10コード、発症日などを保持します。",
        unit: "レセプト",
      },
      {
        id: "allergy",
        physicalName: "allergyIntolerance_table",
        logicalName: "薬剤・その他アレルギー等",
        overview:
          "患者のアレルギー情報（薬剤アレルギー、食物アレルギー等）を管理するテーブル。アレルゲンや重症度などを保持します。",
        unit: "レセプト",
      },
      {
        id: "examination",
        physicalName: "observation_table",
        logicalName: "感染症・検査",
        overview:
          "血液検査、尿検査などの各種検査結果を管理するテーブル。検査項目、基準値、結果値などを保持します。",
        unit: "レセプト",
      },
    ],
    notesText: "留意事項を入力...",
    keyInfoText: "",
    status: "draft",
  },
  tableDefs: {
    condtion_table: EXAMINATION_MOCK_DATA,
    allergyIntolerance_table: EXAMINATION_MOCK_DATA,
    observation_table: EXAMINATION_MOCK_DATA,
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
export async function fetchMetadata(type?: string): Promise<MetadataResponse> {
  const getMockData = (type?: string): MetadataResponse => {
    const data = { ...MOCK_DATA };
    if (type) {
      data.overview = {
        ...data.overview,
        overviewText:
          "\n## データ説明情報\n- \n## 収集期間\n| 項目 | 内容 |\n| --- | --- |\n| 収集開始年度 | |\n| 最新の提供可能年度 | |\n| 収集頻度 | |\n\n## 更新頻度\n対象項目\n\n## テーブル一覧\nテーブル論理名 | 概要 | 格納単位 |\n| --- | --- | --- |\n| | | |\n\n## 留意事項\n-\n## キー情報\n-\n",
      };

      if (type.startsWith("type-")) {
        data.overview.tables = [];
        data.tableDefs = {};
      }
    }

    if (typeof window !== "undefined") {
      const storageKey = type ? `metadata_${type}` : "metadata_top";
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          data.overview = {
            ...data.overview,
            overviewText: parsed.overviewText ?? data.overview.overviewText,
            dataTypes: parsed.dataTypes ?? data.overview.dataTypes,
            startYear: parsed.startYear ?? data.overview.startYear,
            latestYear: parsed.latestYear ?? data.overview.latestYear,
            updateFrequencies:
              parsed.updateFrequencies ?? data.overview.updateFrequencies,
            tables: parsed.tables ?? data.overview.tables,
            notesText: parsed.notesText ?? data.overview.notesText,
            keyInfoText: parsed.keyInfoText ?? data.overview.keyInfoText,
          };
          if (parsed.tableDefs) {
            data.tableDefs = parsed.tableDefs;
          }
        } catch (e) {
          console.error("Failed to parse sessionStorage data", e);
        }
      }
    }

    return data;
  };
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
      return getMockData(type);
    }
  }

  // API URLが未設定の場合はモックデータを返す
  console.info(
    "NEXT_PUBLIC_API_BASE_URL が未設定のため、モックデータを使用します。",
  );
  return getMockData(type);
}
