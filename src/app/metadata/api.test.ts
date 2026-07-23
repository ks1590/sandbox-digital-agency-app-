import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";

const originalEnv = process.env;

describe("api.ts", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("fetchMetadata", () => {
    it("API_BASE_URLが設定されている場合、APIからデータ取得を試みる", async () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = "http://mock-api.local";
      const { fetchMetadata } = await import("./api");

      const mockResponse = { overview: { status: "draft" } };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchMetadata();
      expect(global.fetch).toHaveBeenCalledWith(
        "http://mock-api.local/metadata",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("APIがエラーを返した場合、モックデータにフォールバックする", async () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = "http://mock-api.local";
      const { fetchMetadata, EXAMINATION_MOCK_DATA } = await import("./api");

      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await fetchMetadata();
      expect(result.tableDefs.condtion_table).toEqual(EXAMINATION_MOCK_DATA);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("API_BASE_URLが未設定の場合、モックデータを使用する", async () => {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      const { fetchMetadata } = await import("./api");

      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      const result = await fetchMetadata("type-test");
      expect(result.overview.tables).toEqual([]);
      expect(result.tableDefs).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
