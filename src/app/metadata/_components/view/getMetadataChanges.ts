import { EXAMINATION_MOCK_DATA } from "../../api";
import {
  CHILD_OVERVIEW_TEMPLATE,
  TOP_OVERVIEW_TEMPLATE,
} from "../../constants";
import type { MetadataOverview, TableDefRow, TableInfo } from "../../types";

export interface MetadataChangeItem {
  /** 対象カテゴリ（例: "トップ", "臨床情報", "新規データ種別名" 等） */
  category: string;
  /** 変更フィールド名（例: "データベース全体に関する情報", "データ種別に関する情報", "収集開始年度" 等） */
  field: string;
  /** 変更詳細内容 */
  detail?: string;
  /** 一文で表示するメッセージテキスト */
  text: string;
}

/**
 * 初期モックデータ
 */
const DEFAULT_INITIAL_TOP_OVERVIEW: Partial<MetadataOverview> = {
  databaseDataProductReadMe: TOP_OVERVIEW_TEMPLATE,
  datatypeDataProductNames: [{ identifiler: "臨床情報", name: "臨床情報" }],
  keyInfoText: "",
};

const DEFAULT_INITIAL_CLINICAL_TABLES: TableInfo[] = [
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
];

const DEFAULT_INITIAL_CLINICAL_OVERVIEW: Partial<MetadataOverview> = {
  databaseDataProductReadMe: CHILD_OVERVIEW_TEMPLATE,
  startYear: "2020",
  latestYear: "2026",
  collectionFrequency: "年次",
  updateFrequencies: [
    { target: "項目1", frequency: "月次" },
    { target: "項目2", frequency: "月次" },
    { target: "項目3", frequency: "日次" },
  ],
  tables: DEFAULT_INITIAL_CLINICAL_TABLES,
  notesText: "留意事項を入力...",
  keyInfoText: "",
};

/**
 * 2つの文字列がトリムして等しいかどうか
 */
function isStringEqual(a?: string | null, b?: string | null): boolean {
  const normA = (a || "").trim();
  const normB = (b || "").trim();
  return normA === normB;
}

/**
 * テーブル定義の行データを比較
 */
function areTableRowsEqual(
  r1?: TableDefRow | null,
  r2?: TableDefRow | null,
): boolean {
  if (!r1 || !r2) return false;
  return (
    (r1.physicalName || "") === (r2.physicalName || "") &&
    (r1.logicalName || "") === (r2.logicalName || "") &&
    (r1.dataType || "") === (r2.dataType || "") &&
    String(r1.length ?? "") === String(r2.length ?? "") &&
    (r1.required || "") === (r2.required || "") &&
    (r1.description || "") === (r2.description || "") &&
    (r1.foreignKey || "") === (r2.foreignKey || "") &&
    (r1.masterType || "") === (r2.masterType || "") &&
    (r1.sampleData || "") === (r2.sampleData || "")
  );
}

/**
 * sessionStorage および保存されているメタデータから変更項目の一覧を検出・生成する
 */
export function getMetadataChanges(storage?: Storage): MetadataChangeItem[] {
  const targetStorage =
    storage || (typeof window !== "undefined" ? window.sessionStorage : null);
  if (!targetStorage) return [];

  const changes: MetadataChangeItem[] = [];

  // 1. トップ画面 (metadata_top) の差分検出
  const topSavedRaw = targetStorage.getItem("metadata_top");
  if (topSavedRaw) {
    try {
      const topSaved = JSON.parse(topSavedRaw);
      const category = "トップ";

      // 概要テキスト（トップ画面は「データベース全体に関する情報」）
      if (
        topSaved.databaseDataProductReadMe !== undefined &&
        !isStringEqual(
          topSaved.databaseDataProductReadMe,
          DEFAULT_INITIAL_TOP_OVERVIEW.databaseDataProductReadMe,
        )
      ) {
        changes.push({
          category,
          field: "データベース全体に関する情報",
          detail: "データベース全体に関する情報を編集しました",
          text: "データベース全体に関する情報を編集しました",
        });
      }

      // データ種別一覧
      if (topSaved.datatypeDataProductNames) {
        const initialNames =
          DEFAULT_INITIAL_TOP_OVERVIEW.datatypeDataProductNames || [];
        const currentNames: { identifiler: string; name: string }[] =
          topSaved.datatypeDataProductNames;

        const initialMap = new Map(
          initialNames.map((item) => [item.identifiler, item.name]),
        );
        const currentMap = new Map(
          currentNames.map((item) => [item.identifiler, item.name]),
        );

        // 追加または変更
        currentNames.forEach((item) => {
          if (!initialMap.has(item.identifiler)) {
            changes.push({
              category,
              field: "データ種別",
              detail: `データ種別「${item.name || "名称未設定"}」を追加しました`,
              text: `データ種別「${item.name || "名称未設定"}」を追加しました`,
            });
          } else if (initialMap.get(item.identifiler) !== item.name) {
            changes.push({
              category,
              field: "データ種別",
              detail: `データ種別「${initialMap.get(item.identifiler)}」から「${item.name}」へ名称変更しました`,
              text: `データ種別「${initialMap.get(item.identifiler)}」から「${item.name}」へ名称変更しました`,
            });
          }
        });

        // 削除
        initialNames.forEach((item) => {
          if (!currentMap.has(item.identifiler)) {
            changes.push({
              category,
              field: "データ種別",
              detail: `データ種別「${item.name}」を削除しました`,
              text: `データ種別「${item.name}」を削除しました`,
            });
          }
        });
      }

      // キー情報
      if (
        topSaved.keyInfoText !== undefined &&
        !isStringEqual(
          topSaved.keyInfoText,
          DEFAULT_INITIAL_TOP_OVERVIEW.keyInfoText,
        )
      ) {
        changes.push({
          category,
          field: "キー情報",
          detail: "キー情報を編集しました",
          text: "キー情報を編集しました",
        });
      }
    } catch (e) {
      console.error("Failed to parse metadata_top", e);
    }
  }

  // 2. 個別データ種別 (metadata_*) の差分検出
  // トップの保存データから有効なデータ種別一覧を特定
  const validDataTypes: { identifiler?: string; name?: string }[] = [
    ...(DEFAULT_INITIAL_TOP_OVERVIEW.datatypeDataProductNames || []),
  ];
  if (topSavedRaw) {
    try {
      const topSaved = JSON.parse(topSavedRaw);
      if (
        topSaved.datatypeDataProductNames &&
        Array.isArray(topSaved.datatypeDataProductNames)
      ) {
        // トップで更新されたデータ種別一覧で上書き
        validDataTypes.length = 0;
        validDataTypes.push(...topSaved.datatypeDataProductNames);
      }
    } catch (e) {
      console.error("Failed to parse metadata_top datatypeDataProductNames", e);
    }
  }

  // 走査対象のデータ種別を一意に抽出（重複走査の防止）
  const processedTypes = new Set<string>();
  const typeEntries: { typeName: string; raw: string }[] = [];

  // トップに登録されているデータ種別を走査
  validDataTypes.forEach((dt) => {
    const candidateNames = [dt.name, dt.identifiler].filter((n): n is string =>
      Boolean(n),
    );
    for (const name of candidateNames) {
      if (processedTypes.has(name)) continue;
      const raw = targetStorage.getItem(`metadata_${name}`);
      if (raw) {
        const displayName = dt.name || dt.identifiler || name;
        typeEntries.push({ typeName: displayName, raw });
        candidateNames.forEach((n) => {
          processedTypes.add(n);
        });
        break;
      }
    }
  });

  // トップの登録一覧に含まれないがストレージに存在するキーも処理（スタンドアロンやテスト環境対応）
  for (let i = 0; i < targetStorage.length; i++) {
    const key = targetStorage.key(i);
    if (key?.startsWith("metadata_") && key !== "metadata_top") {
      const typeName = key.replace("metadata_", "");
      if (!processedTypes.has(typeName)) {
        processedTypes.add(typeName);
        const raw = targetStorage.getItem(key);
        if (raw) {
          typeEntries.push({ typeName, raw });
        }
      }
    }
  }

  typeEntries.forEach(({ typeName, raw }) => {
    try {
      const data = JSON.parse(raw);
      const isClinical = typeName === "臨床情報" || typeName === "clinical";
      const category = isClinical ? "臨床情報" : typeName;

      const initialOverview = isClinical
        ? DEFAULT_INITIAL_CLINICAL_OVERVIEW
        : {
            databaseDataProductReadMe: CHILD_OVERVIEW_TEMPLATE,
            startYear: "",
            latestYear: "",
            collectionFrequency: "",
            updateFrequencies: [],
            tables: [],
            notesText: "",
            keyInfoText: "",
          };

      // 概要テキスト（データ種別画面は「データ種別に関する情報」）
      if (
        data.databaseDataProductReadMe !== undefined &&
        !isStringEqual(
          data.databaseDataProductReadMe,
          initialOverview.databaseDataProductReadMe,
        )
      ) {
        const messageText = isClinical
          ? "データ種別に関する情報を編集しました"
          : `データ種別「${category}」に関する情報を編集しました`;
        changes.push({
          category,
          field: "データ種別に関する情報",
          detail: messageText,
          text: messageText,
        });
      }

      // 収集開始年度
      if (
        data.startYear !== undefined &&
        !isStringEqual(data.startYear, initialOverview.startYear)
      ) {
        const from = initialOverview.startYear || "未設定";
        const to = data.startYear || "未設定";
        changes.push({
          category,
          field: "収集開始年度",
          detail: `収集開始年度を「${from}」から「${to}」へ変更しました`,
          text: `収集開始年度を「${from}」から「${to}」へ変更しました`,
        });
      }

      // 最新の提供可能年度
      if (
        data.latestYear !== undefined &&
        !isStringEqual(data.latestYear, initialOverview.latestYear)
      ) {
        const from = initialOverview.latestYear || "未設定";
        const to = data.latestYear || "未設定";
        changes.push({
          category,
          field: "最新の提供可能年度",
          detail: `最新の提供可能年度を「${from}」から「${to}」へ変更しました`,
          text: `最新の提供可能年度を「${from}」から「${to}」へ変更しました`,
        });
      }

      // 収集頻度
      if (
        data.collectionFrequency !== undefined &&
        !isStringEqual(
          data.collectionFrequency,
          initialOverview.collectionFrequency,
        )
      ) {
        const from = initialOverview.collectionFrequency || "未設定";
        const to = data.collectionFrequency || "未設定";
        changes.push({
          category,
          field: "収集頻度",
          detail: `収集頻度を「${from}」から「${to}」へ変更しました`,
          text: `収集頻度を「${from}」から「${to}」へ変更しました`,
        });
      }

      // 更新頻度一覧
      if (data.updateFrequencies !== undefined) {
        const initFrequencies = initialOverview.updateFrequencies || [];
        const isDiff =
          JSON.stringify(data.updateFrequencies) !==
          JSON.stringify(initFrequencies);
        if (isDiff) {
          changes.push({
            category,
            field: "更新頻度",
            detail: `更新頻度（計${data.updateFrequencies.length}件）の設定を変更しました`,
            text: `更新頻度（計${data.updateFrequencies.length}件）の設定を変更しました`,
          });
        }
      }

      // 留意事項
      if (
        data.notesText !== undefined &&
        !isStringEqual(data.notesText, initialOverview.notesText)
      ) {
        changes.push({
          category,
          field: "留意事項",
          detail: "留意事項を編集しました",
          text: "留意事項を編集しました",
        });
      }

      // キー情報
      if (
        data.keyInfoText !== undefined &&
        !isStringEqual(data.keyInfoText, initialOverview.keyInfoText)
      ) {
        changes.push({
          category,
          field: "キー情報",
          detail: "キー情報を編集しました",
          text: "キー情報を編集しました",
        });
      }

      // テーブル一覧
      if (data.tables !== undefined) {
        const initialTables = initialOverview.tables || [];
        const currentTables: TableInfo[] = data.tables;

        const initTableMap = new Map(
          initialTables.map((t) => [t.physicalName, t]),
        );
        const currTableMap = new Map(
          currentTables.map((t) => [t.physicalName, t]),
        );

        // 新規テーブル追加
        currentTables.forEach((t) => {
          if (!initTableMap.has(t.physicalName)) {
            changes.push({
              category,
              field: "テーブル一覧",
              detail: `テーブル一覧に「${t.logicalName || t.physicalName || "新規テーブル"}」を追加しました`,
              text: `テーブル一覧に「${t.logicalName || t.physicalName || "新規テーブル"}」を追加しました`,
            });
          } else {
            const initT = initTableMap.get(t.physicalName)!;
            if (
              initT.logicalName !== t.logicalName ||
              initT.overview !== t.overview ||
              initT.unit !== t.unit
            ) {
              changes.push({
                category,
                field: `テーブル情報（${t.logicalName || t.physicalName}）`,
                detail: `テーブル情報（${t.logicalName || t.physicalName}）を変更しました`,
                text: `テーブル情報（${t.logicalName || t.physicalName}）を変更しました`,
              });
            }
          }
        });

        // 削除テーブル
        initialTables.forEach((t) => {
          if (!currTableMap.has(t.physicalName)) {
            changes.push({
              category,
              field: "テーブル一覧",
              detail: `テーブル一覧から「${t.logicalName || t.physicalName}」を削除しました`,
              text: `テーブル一覧から「${t.logicalName || t.physicalName}」を削除しました`,
            });
          }
        });
      }

      // テーブル定義 (tableDefs)
      if (data.tableDefs !== undefined) {
        const currentTableDefs: Record<string, TableDefRow[]> =
          data.tableDefs || {};
        const tables: TableInfo[] = data.tables || initialOverview.tables || [];

        Object.entries(currentTableDefs).forEach(([physName, rows]) => {
          if (!rows || !Array.isArray(rows)) return;

          const matchedTable = tables.find((t) => t.physicalName === physName);
          const tableName = matchedTable?.logicalName || physName;

          // 臨床情報の初期テーブル定義と比較
          if (
            isClinical &&
            (physName === "condtion_table" ||
              physName === "allergyIntolerance_table" ||
              physName === "observation_table")
          ) {
            const initialRows = EXAMINATION_MOCK_DATA;
            const isRowLengthDiff = rows.length !== initialRows.length;
            const isRowContentDiff = rows.some((row, idx) => {
              const initRow = initialRows[idx];
              return !areTableRowsEqual(row, initRow);
            });

            if (isRowLengthDiff || isRowContentDiff) {
              changes.push({
                category,
                field: `テーブル定義（${tableName}）`,
                detail: `テーブル定義（${tableName}）のカラム定義を編集しました`,
                text: `テーブル定義（${tableName}）のカラム定義を編集しました`,
              });
            }
          } else if (!isClinical && rows.length > 0) {
            changes.push({
              category,
              field: `テーブル定義（${tableName}）`,
              detail: `テーブル定義（${tableName}）のカラム定義が登録されました`,
              text: `テーブル定義（${tableName}）のカラム定義が登録されました`,
            });
          }
        });
      }
    } catch (e) {
      console.error(`Failed to parse metadata_${typeName}`, e);
    }
  });

  return changes;
}
