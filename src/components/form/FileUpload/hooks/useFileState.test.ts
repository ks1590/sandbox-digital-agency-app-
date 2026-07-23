import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFileState } from "./useFileState";

describe("useFileState", () => {
  it("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => useFileState());

    expect(result.current.files).toEqual([]);
    expect(result.current.errors).toEqual([]);
    expect(result.current.hasError).toBe(false);
    expect(result.current.totalSize).toBe(0);
    expect(result.current.isMultiple).toBe(false); // default maxFiles = 1
  });

  it("初期ファイルがある場合、それが状態に反映されること", () => {
    const initialFiles = [
      { id: "1", name: "test.pdf", size: 1024, isExisting: true, errors: [] },
    ];
    const { result } = renderHook(() => useFileState({ initialFiles }));

    expect(result.current.files).toEqual(initialFiles);
    expect(result.current.totalSize).toBe(1024);
  });

  it("単一ファイルモード（maxFiles=1）の場合、新しいファイルを追加すると既存ファイルが置き換えられること", () => {
    const { result } = renderHook(() => useFileState({ maxFiles: 1 }));

    const file1 = new File(["test1"], "test1.pdf", { type: "application/pdf" });
    const file2 = new File(["test2"], "test2.pdf", { type: "application/pdf" });

    act(() => {
      result.current.addFiles([file1]);
    });
    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe("test1.pdf");

    act(() => {
      result.current.addFiles([file2]);
    });
    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe("test2.pdf");
  });

  it("複数ファイルモードの場合、ファイルが追加されること", () => {
    const { result } = renderHook(() => useFileState({ maxFiles: 3 }));

    const file1 = new File(["test1"], "test1.pdf", { type: "application/pdf" });
    const file2 = new File(["test2"], "test2.pdf", { type: "application/pdf" });

    act(() => {
      result.current.addFiles([file1]);
    });
    act(() => {
      result.current.addFiles([file2]);
    });

    expect(result.current.files).toHaveLength(2);
    expect(result.current.files[0].name).toBe("test1.pdf");
    expect(result.current.files[1].name).toBe("test2.pdf");
  });

  it("許可されていない拡張子の場合、ファイルごとのエラーが設定されること", () => {
    const { result } = renderHook(() => useFileState({ accept: ".pdf" }));
    const file = new File(["test"], "test.png", { type: "image/png" });

    act(() => {
      result.current.addFiles([file]);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.files[0].errors).toContain(
      "許可されていないファイル形式です。",
    );
  });

  it("ファイルサイズが上限を超えた場合、ファイルごとのエラーが設定されること", () => {
    const { result } = renderHook(() => useFileState({ maxFileSize: "1kb" })); // 1024 bytes

    const largeContent = new Array(2000).join("a"); // > 1024 bytes
    const file = new File([largeContent], "large.txt", { type: "text/plain" });

    act(() => {
      result.current.addFiles([file]);
    });

    expect(result.current.files[0].errors).toContain(
      "ファイルサイズが上限を超過しています。",
    );
  });

  it("removeFileでファイルが削除されること", () => {
    const { result } = renderHook(() => useFileState({ maxFiles: 2 }));
    const file1 = new File(["test1"], "test1.pdf", { type: "application/pdf" });

    act(() => {
      result.current.addFiles([file1]);
    });
    expect(result.current.files).toHaveLength(1);

    const fileId = result.current.files[0].id;
    act(() => {
      result.current.removeFile(fileId, 0);
    });

    expect(result.current.files).toHaveLength(0);
  });
});
