/**
 * 更新頻度の型定義
 */
export interface UpdateFrequency {
  /** 対象項目 */
  target: string;
  /** 頻度（例: "年次", "月次"） */
  frequency: string;
}

/**
 * テーブル情報の型定義
 */
export interface TableInfo {
  /** テーブルID */
  id: string;
  /** テーブル物理名 */
  physicalName: string;
  /** テーブル論理名 */
  logicalName: string;
  /** 概要 */
  overview: string;
  /** 格納単位 */
  unit: string;
}

/**
 * データ種別の型定義
 */
export interface DataTypeItem {
  /** データ種別ID（例: "clinical", "document"） */
  id: string;
  /** 表示名（例: "臨床情報"） */
  name: string;
}

/**
 * テーブル定義の行データ型定義
 * Go+Lambda APIのレスポンスと一致させる
 */
export interface TableDefRow {
  id: number;
  physicalName: string;
  dataType: string;
  length: number | string;
  required: string;
  logicalName: string;
  description: string;
  foreignKey: string;
  masterType: string;
  sampleData: string;
}

/**
 * テーブル定義のカテゴリ別データ
 */
export interface TableDefCategory {
  disease: TableDefRow[];
  allergy: TableDefRow[];
  examination: TableDefRow[];
}

/**
 * メタデータの概要情報
 */
export interface MetadataOverview {
  /** 概要テキスト */
  overviewText: string;
  /** データ種別一覧 */
  dataTypes: DataTypeItem[];
  /** 収集開始年度 */
  startYear: string;
  /** 最新の提供可能年度 */
  latestYear: string;
  /** 収集頻度 */
  collectionFrequency?: string;
  /** 更新頻度一覧 */
  updateFrequencies: UpdateFrequency[];
  /** テーブル一覧 */
  tables: TableInfo[];
  /** 留意事項 */
  notesText: string;
  /** キー情報テキスト（Mermaid記法） */
  keyInfoText: string;
}

/**
 * API レスポンスの型定義
 */
export interface MetadataResponse {
  /** 概要情報 */
  overview: MetadataOverview;
  /** テーブル定義データ */
  tableDefs: TableDefCategory;
}
