import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import {
  FileUpload,
  FileUploadDropArea,
  FileUploadFileInfo,
  FileUploadFileItem,
  FileUploadFileList,
  FileUploadFileMarker,
  FileUploadFileMeta,
  FileUploadFileName,
  FileUploadInput,
  FileUploadViewportOverlay,
  FileUploadViewportOverlayMessage,
} from "./FileUpload";

describe("FileUpload コンポーネント", () => {
  describe("FileUpload", () => {
    it("子要素がレンダリングされること", () => {
      render(<FileUpload>Test Content</FileUpload>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("maxFilesに応じてdata-multipleが設定されること", () => {
      const { rerender, container } = render(
        <FileUpload maxFiles={1}>Test</FileUpload>,
      );
      expect(container.firstChild).toHaveAttribute("data-multiple", "false");

      rerender(<FileUpload maxFiles={2}>Test</FileUpload>);
      expect(container.firstChild).toHaveAttribute("data-multiple", "true");
    });

    it("hasErrorとdroppableが正しく設定されること", () => {
      const { container } = render(
        <FileUpload hasError droppable>
          Test
        </FileUpload>,
      );
      expect(container.firstChild).toHaveAttribute("data-has-error", "true");
      expect(container.firstChild).toHaveAttribute("data-droppable", "true");
    });
  });

  describe("FileUploadInput", () => {
    it("ファイル入力としてレンダリングされること", () => {
      render(<FileUploadInput aria-label="file-input" />);
      const input = screen.getByLabelText("file-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveClass("hidden");
    });

    it("refが転送されること", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<FileUploadInput ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("INPUT");
    });
  });

  describe("FileUploadDropArea", () => {
    it("isDragOverがtrueの場合、data-dragoverが付与されること", () => {
      const { container } = render(
        <FileUploadDropArea isDragOver>Drop Here</FileUploadDropArea>,
      );
      expect(container.firstChild).toHaveAttribute("data-dragover", "true");
    });
  });

  describe("FileUploadFileList", () => {
    it("ul要素としてレンダリングされること", () => {
      render(
        <FileUploadFileList>
          <li>item</li>
        </FileUploadFileList>,
      );
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });
  });

  describe("FileUploadFileItem", () => {
    it("hasErrorがtrueの場合、data-errorが付与されること", () => {
      const { container } = render(
        <FileUploadFileItem hasError>item</FileUploadFileItem>,
      );
      expect(container.firstChild).toHaveAttribute("data-error", "true");
    });
  });

  describe("Text Components", () => {
    it("FileUploadFileNameが正しくレンダリングされること", () => {
      render(<FileUploadFileName>file.txt</FileUploadFileName>);
      expect(screen.getByText("file.txt")).toBeInTheDocument();
    });

    it("FileUploadFileMetaが正しくレンダリングされること", () => {
      render(<FileUploadFileMeta>100 KB</FileUploadFileMeta>);
      expect(screen.getByText("100 KB")).toBeInTheDocument();
    });

    it("FileUploadFileInfoが正しくレンダリングされること", () => {
      render(<FileUploadFileInfo>Info</FileUploadFileInfo>);
      expect(screen.getByText("Info")).toBeInTheDocument();
    });

    it("FileUploadFileMarkerが正しくレンダリングされること", () => {
      const { container } = render(<FileUploadFileMarker />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("FileUploadViewportOverlay", () => {
    it("documentが存在する場合、PortalとしてBodyにレンダリングされること", () => {
      render(
        <FileUploadViewportOverlay>
          <FileUploadViewportOverlayMessage>
            Overlay Message
          </FileUploadViewportOverlayMessage>
        </FileUploadViewportOverlay>,
      );
      // document.bodyの直下にレンダリングされる
      const message = screen.getByText("Overlay Message");
      expect(message).toBeInTheDocument();
      expect(document.body.contains(message)).toBe(true);
    });
  });
});
