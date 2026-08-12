import { act, renderHook, waitFor } from "@testing-library/react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveMetadata } from "../../api";
import type { MetadataResponse } from "../../types";
import { useMetadataForm } from "./useMetadataForm";

vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mock("../../api", async () => {
  const actual = await vi.importActual<typeof import("../../api")>("../../api");
  return {
    ...actual,
    saveMetadata: vi.fn(),
  };
});

function createApiData(overrides = {}): MetadataResponse {
  return {
    overview: {
      databaseDataProductReadMe: "",
      datatypeDataProductNames: [],
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
      new ReadonlyURLSearchParams(
        new URLSearchParams("type=臨床情報&tab=overview"),
      ),
    );
    vi.mocked(saveMetadata).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("APIデータを正しく初期化する", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.isTopPage).toBe(false);
    expect(result.current.methods.getValues("dataType")).toBe("臨床情報");
  });

  it("セッションストレージにデータがある場合はそれを復元する", () => {
    const savedData = { dataType: "saved_type", databaseDataProductReadMe: "saved text" };
    sessionStorage.setItem("metadata_臨床情報", JSON.stringify(savedData));

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.methods.getValues("dataType")).toBe("saved_type");
    expect(result.current.methods.getValues("databaseDataProductReadMe")).toBe("saved text");
  });

  it("フォームの値が変更されるとセッションストレージに保存する", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.methods.setValue("databaseDataProductReadMe", "new text");
    });

    await waitFor(() => {
      const saved = sessionStorage.getItem("metadata_臨床情報");
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved as string).databaseDataProductReadMe).toBe("new text");
    });
  });

  it("handleSubmit でアクションを呼び出し、ルーティングする（子ページの場合）", async () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    await act(async () => {
      await result.current.handleSubmit(result.current.methods.getValues());
    });

    expect(saveMetadata).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(
      `/metadata/detail?tab=overview&type=${encodeURIComponent("臨床情報")}`,
    );
  });

  it("handleSubmit でトップページの場合は /metadata に遷移し、新規データ種別のID変換と初期データ作成を行う", async () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    vi.mocked(useSearchParams).mockReturnValue(
      new ReadonlyURLSearchParams(new URLSearchParams("tab=data-type")),
    );

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.methods.setValue("datatypeDataProductNames", [
        { identifiler: "type-existing", name: "Existing" },
        { identifiler: "new-type-12345", name: "New One" },
      ]);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.methods.getValues());
    });

    expect(saveMetadata).toHaveBeenCalled();

    // 既存・新規とも ID が名称に統一されていること
    const callArg = vi.mocked(saveMetadata).mock.calls[0][0];
    expect(callArg.datatypeDataProductNames).toEqual([
      { identifiler: "Existing", name: "Existing" },
      { identifiler: "New One", name: "New One" },
    ]);

    // 子要素のセッションストレージが初期化されていること
    const childSaved = sessionStorage.getItem("metadata_New One");
    expect(childSaved).not.toBeNull();
    expect(JSON.parse(childSaved as string).dataType).toBe("New One");

    expect(mockRouter.push).toHaveBeenCalledWith("/metadata?tab=data-type");
  });

  it("新規データ種別追加時に「臨床情報」のセッションデータが存在しない場合、空配列ではなく臨床情報のデフォルトテーブル情報で初期化されること", async () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    vi.mocked(useSearchParams).mockReturnValue(
      new ReadonlyURLSearchParams(new URLSearchParams("tab=data-type")),
    );

    const apiData = createApiData({
      tables: [
        { id: "disease", physicalName: "condtion_table", logicalName: "傷病" },
      ],
    });
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.methods.setValue("datatypeDataProductNames", [
        { identifiler: "臨床情報", name: "臨床情報" },
        { identifiler: "新データ種別", name: "新データ種別" },
      ]);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.methods.getValues());
    });

    const clinicalSaved = sessionStorage.getItem("metadata_臨床情報");
    expect(clinicalSaved).not.toBeNull();
    const parsedClinical = JSON.parse(clinicalSaved as string);
    expect(parsedClinical.tables).toHaveLength(1);
    expect(parsedClinical.tables[0].physicalName).toBe("condtion_table");
  });

  it("handleTabChange でタブのクエリパラメータを更新する", () => {
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.handleTabChange(1); // ER図
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      `/metadata/detail?type=${encodeURIComponent("臨床情報")}&tab=er`,
      { scroll: false },
    );
  });

  it("handleCancel で編集前に保存データがない場合セッションをクリアし、適切な画面に戻る", () => {
    sessionStorage.clear();

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    act(() => {
      result.current.handleCancel();
    });

    expect(sessionStorage.getItem("metadata_臨床情報")).toBeNull();
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/metadata/detail?tab=overview&type=%E8%87%A8%E5%BA%8A%E6%83%85%E5%A0%B1",
    );
  });

  it("handleCancel で編集前に保存データがあった場合、編集前のデータを復元して適切な画面に戻る", () => {
    const savedData = { dataType: "臨床情報", databaseDataProductReadMe: "編集前のデータ" };
    sessionStorage.setItem("metadata_臨床情報", JSON.stringify(savedData));

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    // フォームで一時的に内容を変更
    act(() => {
      result.current.methods.setValue("databaseDataProductReadMe", "編集中の下書き");
    });

    // キャンセル実行
    act(() => {
      result.current.handleCancel();
    });

    // 編集前のデータが復元されていること
    const restored = sessionStorage.getItem("metadata_臨床情報");
    expect(restored).not.toBeNull();
    expect(JSON.parse(restored as string).databaseDataProductReadMe).toBe("編集前のデータ");
  });

  it("トップページの場合、databaseDataProductReadMeにTOP_OVERVIEW_TEMPLATEの内容（キー情報など）が初期設定される", () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    const databaseDataProductReadMe = result.current.methods.getValues("databaseDataProductReadMe");
    expect(databaseDataProductReadMe).toContain("キー情報");
    expect(databaseDataProductReadMe).not.toContain("収集期間");
  });

  it("子ページの場合、databaseDataProductReadMeにCHILD_OVERVIEW_TEMPLATEの内容（収集期間など）が初期設定される", () => {
    vi.mocked(usePathname).mockReturnValue("/metadata/detail");
    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    const databaseDataProductReadMe = result.current.methods.getValues("databaseDataProductReadMe");
    expect(databaseDataProductReadMe).toContain("収集期間");
    expect(databaseDataProductReadMe).not.toContain("キー情報");
  });

  it("fromパラメータが存在する場合、その値に対応するセッションストレージからデータを復元する", () => {
    vi.mocked(usePathname).mockReturnValue("/metadata/table-def");
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "tab=observation_table&from=検診情報",
      ) as unknown as ReadonlyURLSearchParams,
    );
    sessionStorage.setItem(
      "metadata_検診情報",
      JSON.stringify({
        dataType: "検診情報",
        tables: [
          {
            identifiler: "1",
            physicalName: "observation_table",
            logicalName: "健診結果",
          },
        ],
      }),
    );

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    const tables = result.current.methods.getValues("tables");
    expect(tables).toEqual([
      { identifiler: "1", physicalName: "observation_table", logicalName: "健診結果" },
    ]);
  });

  it("トップページ保存時に削除されたデータ種別のセッションストレージがクリーンアップされること", async () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    vi.mocked(useSearchParams).mockReturnValue(
      new ReadonlyURLSearchParams(new URLSearchParams("tab=data-type")),
    );
    sessionStorage.setItem(
      "metadata_削除されたデータ種別",
      JSON.stringify({ dummy: true }),
    );
    sessionStorage.setItem(
      "metadata_残るデータ種別",
      JSON.stringify({ dummy: true }),
    );

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    await act(async () => {
      await result.current.handleSubmit({
        dataType: "臨床情報",
        datatypeDataProductNames: [{ identifiler: "残るデータ種別", name: "残るデータ種別" }],
      });
    });

    expect(sessionStorage.getItem("metadata_削除されたデータ種別")).toBeNull();
    expect(sessionStorage.getItem("metadata_残るデータ種別")).not.toBeNull();
  });

  it("新規データ種別を追加して保存した際、臨床情報以外のデータ種別の初期tablesとtableDefsが空で初期化されること", async () => {
    vi.mocked(usePathname).mockReturnValue("/metadata");
    vi.mocked(useSearchParams).mockReturnValue(
      new ReadonlyURLSearchParams(new URLSearchParams("tab=data-type")),
    );

    const apiData = createApiData();
    const { result } = renderHook(() => useMetadataForm(apiData));

    await act(async () => {
      await result.current.handleSubmit({
        dataType: "臨床情報",
        datatypeDataProductNames: [
          { identifiler: "臨床情報", name: "臨床情報" },
          { identifiler: "新規データ種別", name: "新規データ種別" },
        ],
      });
    });

    const newDataTypeStorage = sessionStorage.getItem(
      "metadata_新規データ種別",
    );
    expect(newDataTypeStorage).not.toBeNull();
    if (newDataTypeStorage) {
      const parsed = JSON.parse(newDataTypeStorage);
      expect(parsed.tables).toEqual([]);
      expect(parsed.tableDefs).toEqual({});
    }
  });
});
