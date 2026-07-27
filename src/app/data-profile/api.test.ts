import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDataProfile, MOCK_DATA } from "./api";

describe("fetchDataProfile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("API_BASE_URL が未設定の場合はモックデータを返す", async () => {
    // テスト環境では NEXT_PUBLIC_API_BASE_URL は未設定
    const result = await fetchDataProfile();

    expect(result).toEqual(MOCK_DATA);
  });

  it("モックデータは3カテゴリを含む", async () => {
    const result = await fetchDataProfile();

    expect(result.categories).toHaveLength(3);
    expect(result.categories.map((c) => c.categoryId)).toEqual([
      "disease",
      "allergy",
      "examination",
    ]);
  });

  it("各カテゴリの行データが生成されている", async () => {
    const result = await fetchDataProfile();

    for (const category of result.categories) {
      expect(category.rows.length).toBeGreaterThan(0);
      expect(category.rows[0]).toHaveProperty("physicalName");
      expect(category.rows[0]).toHaveProperty("logicalName");
    }
  });
});
