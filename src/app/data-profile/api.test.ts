import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchDataProfile, MOCK_DATA } from "./api";

describe("fetchDataProfile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe("API_BASE_URL が未設定の場合", () => {
    it("モックデータを返す", async () => {
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

  describe("API_BASE_URL が設定されている場合", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it("API からデータを取得して返す", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
      const mockApiResponse = {
        periodFrom: "2026年1月",
        periodTo: "2026年3月",
        totalRows: 200,
        totalFiles: 20,
        categories: [],
      };

      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      // 環境変数設定後にモジュールを再読み込み
      const { fetchDataProfile: fetchDataProfileWithUrl } = await import(
        "./api"
      );
      const result = await fetchDataProfileWithUrl();

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/data-profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      expect(result).toEqual(mockApiResponse);
    });

    it("API レスポンスが ok でない場合、エラーログを出力してモックデータにフォールバックする", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const { fetchDataProfile: fetchDataProfileWithUrl } = await import(
        "./api"
      );
      const result = await fetchDataProfileWithUrl();

      expect(result).toEqual(MOCK_DATA);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("fetch が例外を投げた場合、エラーログを出力してモックデータにフォールバックする", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        new Error("Network Failure"),
      );

      const { fetchDataProfile: fetchDataProfileWithUrl } = await import(
        "./api"
      );
      const result = await fetchDataProfileWithUrl();

      expect(result).toEqual(MOCK_DATA);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
