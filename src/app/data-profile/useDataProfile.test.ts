import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as apiModule from "./api";
import type { DataProfileResponse } from "./types";
import { useDataProfile } from "./useDataProfile";

const mockResponse: DataProfileResponse = {
  periodFrom: "2026年4月",
  periodTo: "2026年6月",
  totalRows: 100,
  totalFiles: 10,
  categories: [],
};

describe("useDataProfile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("初期状態は loading であり、データ取得成功後に success とデータが設定される", async () => {
    vi.spyOn(apiModule, "fetchDataProfile").mockResolvedValueOnce(
      mockResponse,
    );

    const { result } = renderHook(() => useDataProfile());

    // 初期値
    expect(result.current).toEqual({
      status: "loading",
      data: null,
      error: null,
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current).toEqual({
      status: "success",
      data: mockResponse,
      error: null,
    });
  });

  it("データ取得失敗時は error ステータスとエラーオブジェクトが設定される", async () => {
    const testError = new Error("Fetch failed");
    vi.spyOn(apiModule, "fetchDataProfile").mockRejectedValueOnce(testError);

    const { result } = renderHook(() => useDataProfile());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current).toEqual({
      status: "error",
      data: null,
      error: testError,
    });
  });

  it("Error以外の例外がスローされた場合も Error インスタンスに正規化される", async () => {
    vi.spyOn(apiModule, "fetchDataProfile").mockRejectedValueOnce(
      "String error",
    );

    const { result } = renderHook(() => useDataProfile());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.status).toBe("error");
    if (result.current.status === "error") {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error.message).toBe("String error");
    }
  });

  it("コンポーネントがアンマウントされた場合、非同期処理完了後の状態更新は行われない", async () => {
    let resolvePromise!: (value: DataProfileResponse) => void;
    const promise = new Promise<DataProfileResponse>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(apiModule, "fetchDataProfile").mockReturnValueOnce(promise);

    const { result, unmount } = renderHook(() => useDataProfile());

    expect(result.current.status).toBe("loading");

    // アンマウント実行
    unmount();

    // Promiseの解決
    resolvePromise(mockResponse);
    await promise;

    // unmountされているため、result.current は loading のまま
    expect(result.current.status).toBe("loading");
  });
});
