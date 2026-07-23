import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label コンポーネント", () => {
  it("正しくレンダリングされること", () => {
    render(<Label>ラベルテキスト</Label>);
    const label = screen.getByText("ラベルテキスト");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    // default size is md
    expect(label).toHaveAttribute("data-size", "md");
  });

  it("sizeプロパティが適用されること", () => {
    const { container } = render(<Label size="lg">ラベル</Label>);
    expect(container.firstChild).toHaveAttribute("data-size", "lg");
  });

  it("htmlForなどのプロパティが転送されること", () => {
    const { container } = render(<Label htmlFor="input-1">ラベル</Label>);
    expect(container.firstChild).toHaveAttribute("for", "input-1");
  });
});
