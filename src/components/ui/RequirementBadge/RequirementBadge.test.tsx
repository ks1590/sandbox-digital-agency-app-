import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RequirementBadge } from "./RequirementBadge";

describe("RequirementBadge コンポーネント", () => {
  it("必須（isOptional=false/undefined）として正しくレンダリングされること", () => {
    render(<RequirementBadge>必須</RequirementBadge>);
    const badge = screen.getByText("必須");
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
    expect(badge).not.toHaveAttribute("data-is-optional");
  });

  it("任意（isOptional=true）として正しくレンダリングされること", () => {
    const { container } = render(
      <RequirementBadge isOptional>任意</RequirementBadge>,
    );
    expect(container.firstChild).toHaveAttribute("data-is-optional", "true");
  });
});
