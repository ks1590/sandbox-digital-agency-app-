import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LinkCard from "./LinkCard";

describe("LinkCard", () => {
  it("渡されたタイトルとリンク先が正しくレンダリングされること", () => {
    render(<LinkCard title="テストタイトル" href="/test-url" />);

    const link = screen.getByRole("link", { name: "テストタイトル" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-url");
  });
});
