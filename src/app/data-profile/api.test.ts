import { afterEach, describe, expect, it, vi } from "vitest";

const MOCK_API_BASE_URL = "http://localhost:8080";

describe("fetchDataProfile", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("API_BASE_URLが設定されていない場合、モックデータが返されること", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const { fetchDataProfile } = await import("./api");

    const data = await fetchDataProfile();
    expect(data.periodFrom).toBe("2026年4月");
    expect(data.categories.length).toBe(3);
  });

  it("API_BASE_URLが設定されており、APIが成功した場合、APIのデータが返されること", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", MOCK_API_BASE_URL);
    const { fetchDataProfile } = await import("./api");

    const mockResponse = {
      periodFrom: "2024年1月",
      periodTo: "2024年12月",
      totalRows: 1000,
      totalFiles: 50,
      categories: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await fetchDataProfile();
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOCK_API_BASE_URL}/data-profile`,
      expect.any(Object),
    );
    expect(data).toEqual(mockResponse);
  });

  it("API_BASE_URLが設定されているが、APIエラーになった場合、モックデータが返されること", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", MOCK_API_BASE_URL);
    const { fetchDataProfile } = await import("./api");

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const data = await fetchDataProfile();
    expect(data.periodFrom).toBe("2026年4月");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("API_BASE_URLが設定されているが、fetchが例外をスローした場合、モックデータが返されること", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", MOCK_API_BASE_URL);
    const { fetchDataProfile } = await import("./api");

    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const data = await fetchDataProfile();
    expect(data.periodFrom).toBe("2026年4月");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
