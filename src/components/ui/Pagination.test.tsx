import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Pagination,
  PaginationCurrent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from "./Pagination";

describe("Pagination コンポーネント", () => {
  it("Pagination: 正しくナビゲーションとしてレンダリングされること", () => {
    render(
      <Pagination aria-label="テストページネーション">
        <div>Content</div>
      </Pagination>,
    );
    const nav = screen.getByRole("navigation", {
      name: "テストページネーション",
    });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("PaginationItem: リンクとしてレンダリングされること", () => {
    render(<PaginationItem href="/page/2">2</PaginationItem>);
    const link = screen.getByRole("link", { name: "2" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/page/2");
  });

  it("PaginationFirst: 最初のページへのリンクとしてレンダリングされること", () => {
    render(<PaginationFirst href="/page/1" />);
    const link = screen.getByRole("link", { name: "最初のページに移動する" });
    expect(link).toBeInTheDocument();
  });

  it("PaginationPrev: 前のページへのリンクとしてレンダリングされること", () => {
    render(<PaginationPrev href="/page/1" aria-label="前へ" />);
    const link = screen.getByRole("link", { name: "前へ" });
    expect(link).toBeInTheDocument();
  });

  it("PaginationNext: 次のページへのリンクとしてレンダリングされること", () => {
    render(<PaginationNext href="/page/3" />);
    const link = screen.getByRole("link", { name: "次のページへ進む" });
    expect(link).toBeInTheDocument();
  });

  it("PaginationLast: 最後のページへのリンクとしてレンダリングされること", () => {
    render(<PaginationLast href="/page/10" />);
    const link = screen.getByRole("link", { name: "最後のページに移動する" });
    expect(link).toBeInTheDocument();
  });

  it("PaginationEllipsis: SVG要素としてレンダリングされること", () => {
    render(<PaginationEllipsis data-testid="ellipsis" />);
    const svg = screen.getByTestId("ellipsis");
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("PaginationCurrent: 現在のページと最大ページが正しく表示されること", () => {
    render(<PaginationCurrent current={5} max={10} />);
    const currentText = screen.getByText("5");
    expect(currentText).toBeInTheDocument();
    expect(currentText).toHaveAttribute("aria-current", "page");

    // 全体のテキストが含まれること
    const container = currentText.parentElement;
    expect(container).toHaveTextContent("5 / 10");
  });
});
