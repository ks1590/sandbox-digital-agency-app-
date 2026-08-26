import { describe, expect, it } from "vitest";
import {
  DATA_PROFILE_PERIOD_END,
  DATA_PROFILE_PERIOD_START,
} from "./constants";

describe("constants", () => {
  it("集計対象期間の定数が正しく定義されている", () => {
    expect(DATA_PROFILE_PERIOD_START).toBe("2026年4月");
    expect(DATA_PROFILE_PERIOD_END).toBe("2026年6月");
  });
});
