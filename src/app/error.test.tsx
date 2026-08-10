import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import ErrorPage from "./error";

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ErrorPage", () => {
  const mockRouter = { back: vi.fn() };
  const mockReset = vi.fn();
  const mockError = new Error("Test Error");

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    // console.error の出力を抑制
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("エラーメッセージとボタンが正しく表示されること", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(
      screen.getByText("システムエラーが発生しました"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/システムで予期せぬエラーが発生しました/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "前の画面に戻る" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  });

  it("マウント時にコンソールエラーが出力されること", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("「前の画面に戻る」ボタンをクリックすると router.back が呼ばれること", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    const backButton = screen.getByRole("button", { name: "前の画面に戻る" });
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("「再試行」ボタンをクリックすると reset 関数が呼ばれること", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    const retryButton = screen.getByRole("button", { name: "再試行" });
    fireEvent.click(retryButton);

    expect(mockReset).toHaveBeenCalled();
  });
});
