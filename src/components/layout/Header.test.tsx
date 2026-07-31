import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import Header from "./Header";

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Header", () => {
  const mockReplace = vi.fn();
  const mockUseRouter = useRouter as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    localStorage.clear();
  });

  it("未ログイン時はユーザーアイコンやメニューボタンが表示されないこと", () => {
    render(<Header />);
    expect(screen.queryByText("test-userA")).not.toBeInTheDocument();
    expect(screen.queryByText("メニュー")).not.toBeInTheDocument();
  });

  it("ログイン時はユーザー名とメニューボタンが表示されること", () => {
    localStorage.setItem("login-user-id", "test-userA");
    render(<Header />);
    expect(screen.getByText("test-userA")).toBeInTheDocument();
    expect(screen.getByText("メニュー")).toBeInTheDocument();
  });

  it("メニューボタンをクリックするとメニューが開閉すること", () => {
    localStorage.setItem("login-user-id", "test-userA");
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /メニュー/ });
    fireEvent.click(menuButton);

    // メニューが開いたことの確認
    expect(screen.getByText("閉じる")).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();

    // もう一度クリックして閉じる
    fireEvent.click(screen.getByRole("button", { name: /閉じる/ }));
    expect(screen.getByText("メニュー")).toBeInTheDocument();
    expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
  });

  it("test-userA ログイン時は特定のメニュー項目が表示されること", () => {
    localStorage.setItem("login-user-id", "test-userA");
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /メニュー/ }));

    expect(screen.getByText("月次抽出依頼検索")).toBeInTheDocument();
    expect(screen.queryByText("メタデータ参照・登録")).not.toBeInTheDocument();
  });

  it("test-userB ログイン時は特定のメニュー項目が表示されること", () => {
    localStorage.setItem("login-user-id", "test-userB");
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /メニュー/ }));

    expect(screen.getByText("メタデータ参照・登録")).toBeInTheDocument();
    expect(screen.getByText("データプロファイル参照")).toBeInTheDocument();
    expect(screen.queryByText("月次抽出依頼検索")).not.toBeInTheDocument();
  });

  it("ログアウトボタンをクリックすると localStorage がクリアされ、ログイン画面にリダイレクトされること", () => {
    localStorage.setItem("login-user-id", "test-userA");
    localStorage.setItem("auth-token", "dummy-token");
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: /メニュー/ }));
    fireEvent.click(screen.getByText("ログアウト"));

    expect(localStorage.getItem("login-user-id")).toBeNull();
    expect(localStorage.getItem("auth-token")).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
