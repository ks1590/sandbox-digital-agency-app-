import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SupportText } from "./SupportText";

describe("SupportText コンポーネント", () => {
  it("正しくレンダリングされること", () => {
    render(<SupportText>サポートテキスト</SupportText>);
    const text = screen.getByText("サポートテキスト");
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-solid-gray-600");
  });

  it("classNameが追加されること", () => {
    const { container } = render(
      <SupportText className="custom-class">テキスト</SupportText>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
