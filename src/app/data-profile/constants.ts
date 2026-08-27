import type { DataTypeOption } from "./types";

/**
 * データプロファイル集計対象期間
 */
export const DATA_PROFILE_PERIOD_START = "2025年4月";
export const DATA_PROFILE_PERIOD_END = "2027年3月";

/**
 * データプロファイルで選択可能なデータ種別一覧
 */
export const DATA_PROFILE_DATA_TYPES: DataTypeOption[] = [
  { id: "clinical", name: "臨床情報" },
  { id: "receipt", name: "レセプト情報" },
  { id: "dpc", name: "DPC情報" },
  { id: "checkup", name: "特定健診情報" },
];

