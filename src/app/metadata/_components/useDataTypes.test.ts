import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDataTypes } from "./useDataTypes";

beforeEach(() => {
  sessionStorage.clear();
});

describe("useDataTypes", () => {
  it("初期データ種別からIDに対応する名称を解決する", () => {
    const { result } = renderHook(() =>
      useDataTypes([
        { identifiler: "clinical", name: "臨床情報" },
        { identifiler: "document", name: "文書情報" },
      ]),
    );

    expect(result.current.getDataTypeName("clinical")).toBe("臨床情報");
    expect(result.current.getDataTypeName("document")).toBe("文書情報");
  });

  it("未知のIDの場合はID文字列をそのまま返す", () => {
    const { result } = renderHook(() =>
      useDataTypes([{ identifiler: "clinical", name: "臨床情報" }]),
    );

    expect(result.current.getDataTypeName("unknown")).toBe("unknown");
  });

  it("初期値未指定の場合はデフォルトの臨床情報を持つ", () => {
    const { result } = renderHook(() => useDataTypes());

    expect(result.current.getDataTypeName("clinical")).toBe("臨床情報");
  });

  it("sessionStorage(metadata_top) の種別があれば上書きする", async () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({ datatypeDataProductNames: [{ identifiler: "custom", name: "カスタム種別" }] }),
    );

    const { result } = renderHook(() =>
      useDataTypes([{ identifiler: "clinical", name: "臨床情報" }]),
    );

    await waitFor(() => {
      expect(result.current.getDataTypeName("custom")).toBe("カスタム種別");
    });
  });

  it("initialDataTypesの要素数が少なくても sessionStorage(metadata_top) にある複数リストを保護・維持する", async () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        datatypeDataProductNames: [
          { identifiler: "111", name: "111" },
          { identifiler: "222", name: "222" },
        ],
      }),
    );

    const { result } = renderHook(() =>
      useDataTypes([{ identifiler: "111", name: "111" }]),
    );

    await waitFor(() => {
      expect(result.current.datatypeDataProductNames.length).toBe(2);
      expect(result.current.getDataTypeName("222")).toBe("222");
    });
  });
});
