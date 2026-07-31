import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
} from "./ModalDialog";

describe("ModalDialog コンポーネント", () => {
  describe("ModalDialog", () => {
    it("ダイアログとして正しくレンダリングされること", () => {
      render(
        <ModalDialog data-testid="dialog">
          <div>内容</div>
        </ModalDialog>,
      );
      const dialog = screen.getByTestId("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog.tagName).toBe("DIALOG");
    });

    it("背景（バックドロップ）をクリックした場合、closeメソッドが呼ばれonClickイベントが発火すること", () => {
      const handleClick = vi.fn();
      render(
        <ModalDialog data-testid="dialog" onClick={handleClick}>
          <div data-testid="inner">内容</div>
        </ModalDialog>,
      );
      const dialog = screen.getByTestId("dialog") as HTMLDialogElement;

      // close メソッドをモックする
      dialog.close = vi.fn();

      // ダイアログ自体（バックドロップ）をクリック
      fireEvent.click(dialog);

      expect(dialog.close).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("内部の要素をクリックした場合は、stopPropagationで伝播が止まるか、e.targetが異なるためcloseされないこと", () => {
      const handleClick = vi.fn();
      render(
        <ModalDialog data-testid="dialog" onClick={handleClick}>
          {/* ModalDialogContentが内部クリックの伝播を止める想定 */}
          <ModalDialogContent data-testid="content">内容</ModalDialogContent>
        </ModalDialog>,
      );
      const dialog = screen.getByTestId("dialog") as HTMLDialogElement;
      const content = screen.getByTestId("content");

      dialog.close = vi.fn();

      // コンテンツをクリック
      fireEvent.click(content);

      // dialogのcloseは呼ばれない
      expect(dialog.close).not.toHaveBeenCalled();
      // コンテンツ内部でstopPropagationされているためonClickも呼ばれない
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("refが正しく転送されること", () => {
      const ref = React.createRef<HTMLDialogElement>();
      render(<ModalDialog ref={ref}>refテスト</ModalDialog>);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("DIALOG");
    });
  });

  describe("サブコンポーネント", () => {
    it("ModalDialogContent: divとして正しくレンダリングされること", () => {
      render(
        <ModalDialogContent data-testid="content">
          コンテント
        </ModalDialogContent>,
      );
      const content = screen.getByTestId("content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("bg-white", "rounded-lg", "shadow-xl");
    });

    it("ModalDialogHeader: divとして正しくレンダリングされること", () => {
      render(
        <ModalDialogHeader data-testid="header">ヘッダー</ModalDialogHeader>,
      );
      const header = screen.getByTestId("header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("border-b");
    });

    it("ModalDialogHeading: h2として正しくレンダリングされ、refが転送されること", () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<ModalDialogHeading ref={ref}>見出し</ModalDialogHeading>);
      const heading = screen.getByRole("heading", { level: 2, name: "見出し" });
      expect(heading).toBeInTheDocument();
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("H2");
    });

    it("ModalDialogBody: divとして正しくレンダリングされること", () => {
      render(<ModalDialogBody data-testid="body">ボディ</ModalDialogBody>);
      const body = screen.getByTestId("body");
      expect(body).toBeInTheDocument();
      expect(body).toHaveClass("px-6", "py-6", "text-gray-700");
    });

    it("ModalDialogActions: divとして正しくレンダリングされること", () => {
      render(
        <ModalDialogActions data-testid="actions">
          アクション
        </ModalDialogActions>,
      );
      const actions = screen.getByTestId("actions");
      expect(actions).toBeInTheDocument();
      expect(actions).toHaveClass("bg-gray-50", "flex", "items-center");
    });
  });
});
