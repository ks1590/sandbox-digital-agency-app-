import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditFormFooter from "./EditFormFooter";

describe("EditFormFooter", () => {
  it("returnHref と returnText がない場合、キャンセルと仮登録ボタンのみ表示される", () => {
    const mockOnCancel = vi.fn();
    render(<EditFormFooter onCancel={mockOnCancel} />);

    expect(
      screen.getByRole("button", { name: "キャンセル" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "仮登録" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("returnHref と returnText がある場合、戻るリンクが表示される", () => {
    const mockOnCancel = vi.fn();
    render(
      <EditFormFooter
        onCancel={mockOnCancel}
        returnHref="/back"
        returnText="戻る"
      />,
    );

    const link = screen.getByRole("link", { name: "戻る" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/back");
  });

  it("キャンセルボタンをクリックすると、onCancel が呼ばれる", () => {
    const mockOnCancel = vi.fn();
    render(<EditFormFooter onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
