import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFileUpload } from "./useFileUpload";

describe("useFileUpload", () => {
  it("すべてのプロパティとハンドラーを返すこと", () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.files).toBeDefined();
    expect(result.current.errors).toBeDefined();
    expect(result.current.totalSize).toBeDefined();
    expect(result.current.hasError).toBeDefined();

    expect(result.current.isDragOver).toBeDefined();
    expect(result.current.isExpandedDropArea).toBeDefined();
    expect(result.current.showViewportOverlay).toBeDefined();
    expect(result.current.announcerText).toBeDefined();

    expect(typeof result.current.handleSelectButtonClick).toBe("function");
    expect(typeof result.current.handleInputChange).toBe("function");
    expect(typeof result.current.handleDragEnter).toBe("function");
    expect(typeof result.current.handleDrop).toBe("function");
  });
});
