import { act, renderHook, waitFor } from "@testing-library/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveMetadataAction } from "../../actions";
import type { MetadataResponse } from "../../types";
import { useMetadataForm } from "./useMetadataForm";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mock("../../actions", () => ({
  saveMetadataAction: vi.fn(),
}));

function createApiData(overrides = {}): MetadataResponse {
  return {
    overview: {
      overviewText: "",
      dataTypes: [],
      startYear: "",
      latestYear: "",
      updateFrequencies: [],
      tables: [],
      notesText: "",
      keyInfoText: "",
      ...overrides,
    },
    tableDefs: {},
  };
}

describe("useMetadataForm", () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(usePathname).mockReturnValue("/metadata/detail");
    vi.mocked(useSearchParams).mockReturnValue(
      new ReadonlyURLSearchParams(new URLSearchParams("type=clinical&tab=overview")),
    );
    vi.mocked(saveMetadataAction).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("APIデータを正しく初期化する", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.isTopPage).toBe(false);
    expect(result.current.methods.getValues("dataType")).toBe("clinical");
  });

  it("セッションストレージにデータがある場合はそれを復元する", () => {
    const savedData = { dataType: "saved_type", overviewText: "saved text" };
    sessionStorage.setItem("metadata_clinical", JSON.stringify(savedData));

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.methods.getValues("dataType")).toBe("saved_type");
    expect(result.current.methods.getValues("overviewText")).toBe("saved text");
  });

  it("フォームの値が変更されるとセッションストレージに保存する", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.methods.setValue("overviewText", "new text");
    });

    await waitFor(() => {
      const saved = sessionStorage.getItem("metadata_clinical");
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved as string).overviewText).toBe("new text");
    });
  });

  it("handleSubmit でアクションを呼び出し、ルーティングする（子ページの場合）", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    await act(async () => {
      await result.current.handleSubmit(result.current.methods.getValues());
    });

    expect(saveMetadataAction).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/metadata/detail?tab=overview&type=clinical",
    );
  });

  it("handleSubmit でトップページの場合は /metadata に遷移する", async () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(new URLSearchParams("")));

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    await act(async () => {
      await result.current.handleSubmit(result.current.methods.getValues());
    });

    expect(saveMetadataAction).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/metadata");
  });

  it("handleTabChange でタブのクエリパラメータを更新する", () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.handleTabChange(1); // ER図
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/metadata/detail?type=clinical&tab=er",
      { scroll: false },
    );
  });

  it("handleCancel でセッションをクリアし、適切な画面に戻る", () => {
    sessionStorage.setItem("metadata_clinical", JSON.stringify({}));

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.handleCancel();
    });

    expect(sessionStorage.getItem("metadata_clinical")).toBeNull();
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/metadata/detail?tab=overview",
    );
  });
});
