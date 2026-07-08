/**
 * データプロファイルの行データ型定義
 * Go+Lambda APIのレスポンスと一致させる
 */
export interface DataProfileRow {
  id: number;
  columnName: string;
  maxLength: number;
  avgLength: number;
  distinctCount: number;
  maxValue: number;
  minValue: number;
  validRatio: string;
  invalidRatio: string;
  nullRatio: string;
}

/**
 * タブごとのデータプロファイル
 */
export interface DataProfileCategory {
  /** カテゴリ識別子（例: "disease", "allergy", "examination"） */
  categoryId: string;
  /** タブ表示名（例: "傷病名"） */
  label: string;
  /** データプロファイル行一覧 */
  rows: DataProfileRow[];
}

/**
 * API レスポンスの型定義
 */
export interface DataProfileResponse {
  /** 集計対象期間 - 開始 */
  periodFrom: string;
  /** 集計対象期間 - 終了 */
  periodTo: string;
  /** 合計行数 */
  totalRows: number;
  /** 合計ファイル数 */
  totalFiles: number;
  /** カテゴリ別データプロファイル */
  categories: DataProfileCategory[];
}
