import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorText } from "./ErrorText";

describe("ErrorText コンポーネント", () => {
  it("正しくレンダリングされること", () => {
    render(<ErrorText>エラーメッセージ</ErrorText>);
    const text = screen.getByText("エラーメッセージ");
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-error-1");
  });

  it("classNameが追加されること", () => {
    const { container } = render(
      <ErrorText className="custom-class">エラー</ErrorText>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
