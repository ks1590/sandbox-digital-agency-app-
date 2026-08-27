import { describe, expect, it } from "vitest";
import {
  DATA_PROFILE_DATA_TYPES,
  DATA_PROFILE_PERIOD_END,
  DATA_PROFILE_PERIOD_START,
} from "./constants";

describe("constants", () => {
  it("集計対象期間の定数が正しく定義されている", () => {
    expect(DATA_PROFILE_PERIOD_START).toBe("2025年4月");
    expect(DATA_PROFILE_PERIOD_END).toBe("2027年3月");
  });

  it("データ種別の選択肢一覧が定義されている", () => {
    expect(DATA_PROFILE_DATA_TYPES).toEqual([
      { id: "clinical", name: "臨床情報" },
      { id: "receipt", name: "レセプト情報" },
      { id: "dpc", name: "DPC情報" },
      { id: "checkup", name: "特定健診情報" },
    ]);
  });
});

