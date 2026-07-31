import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFileUpload } from "@/components/form/FileUpload/hooks/useFileUpload";
import { fileUploadDefaultMessages } from "@/components/form/FileUpload/messages";
import ErDiagramTabContent from "./ErDiagramTabContent";

vi.mock("@/components/form/FileUpload/hooks/useFileUpload", () => ({
  useFileUpload: vi.fn(),
}));

describe("ErDiagramTabContent", () => {
  const baseUseFileUploadReturn = {
    files: [],
    errors: [],
    isDragOver: false,
    hasError: false,
    totalSize: 0,
    isMultiple: false,
    maxFileSizeBytes: null,
    maxTotalSizeBytes: null,
    selectionSummarySuffix: "test",
    inputRef: { current: null },
    selectButtonRef: { current: null },
    setFiles: vi.fn(),
    setErrors: vi.fn(),
    addFiles: vi.fn(),
    removeFile: vi.fn(),
    validateFiles: vi.fn(),
    handleSelectButtonClick: vi.fn(),
    handleInputChange: vi.fn(),
    handleDragEnter: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    isExpandedDropArea: false,
    showViewportOverlay: false,
    announcerText: "",
    announcerAssertiveText: "",
    messages: fileUploadDefaultMessages,
    handleExpandedDropAreaChange: vi.fn(),
    handleViewportDragEnter: vi.fn(),
    handleViewportDragOver: vi.fn(),
    handleViewportDragLeave: vi.fn(),
    handleViewportDrop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("初期状態（ファイルなし）で正しくレンダリングされる", () => {
    vi.mocked(useFileUpload).mockReturnValue(baseUseFileUploadReturn);

    render(<ErDiagramTabContent />);

    expect(screen.getByText("ファイルアップロード")).toBeInTheDocument();
    expect(
      screen.getByText("ファイルが選択されていません"),
    ).toBeInTheDocument();
  });

  it("初期画像URLが提供された場合、プレビューと削除ボタンが表示される", () => {
    vi.mocked(useFileUpload).mockReturnValue(baseUseFileUploadReturn);

    render(<ErDiagramTabContent initialImageUrl="http://example.com/er.png" />);

    const previewImage = screen.getByAltText("ER図プレビュー");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute("src", "http://example.com/er.png");

    expect(
      screen.getByText("既にファイルが登録されています"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("削除ボタンをクリックすると、プレビューが消える", () => {
    vi.mocked(useFileUpload).mockReturnValue(baseUseFileUploadReturn);

    render(<ErDiagramTabContent initialImageUrl="http://example.com/er.png" />);

    const deleteButton = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteButton);

    expect(screen.queryByAltText("ER図プレビュー")).not.toBeInTheDocument();
    expect(
      screen.getByText("ファイルが選択されていません"),
    ).toBeInTheDocument();
  });

  it("ファイルがアップロードされた場合、ファイルのプレビューとファイル情報が表示される", () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    vi.mocked(useFileUpload).mockReturnValue({
      ...baseUseFileUploadReturn,
      files: [
        {
          id: "1",
          file: mockFile,
          name: "test.png",
          size: 1024,
        },
      ],
      totalSize: 1024,
    });

    render(<ErDiagramTabContent />);

    const previewImage = screen.getByAltText("ER図プレビュー");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute(
      "src",
      "blob:http://localhost/test-url",
    );

    expect(screen.getByText("test.png")).toBeInTheDocument();
    expect(screen.getByText("解除")).toBeInTheDocument();
  });
});
