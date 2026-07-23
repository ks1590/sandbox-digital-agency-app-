import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PortalPage from "./page";

// Mock Header
vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header-mock">Header</header>,
}));

// Mock LinkCard
vi.mock("@/components/ui/LinkCard", () => ({
  default: ({ title, href }: { title: string; href: string }) => (
    <a data-testid="link-card-mock" href={href}>
      {title}
    </a>
  ),
}));

describe("PortalPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset localStorage
    window.localStorage.clear();
  });

  it("初期状態（userIdなし）の場合、「メニューを読み込み中...」が表示されること", () => {
    render(<PortalPage />);

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByText("メニューを読み込み中...")).toBeInTheDocument();
    expect(screen.queryByTestId("link-card-mock")).not.toBeInTheDocument();
  });

  it("test-userAでログインしている場合、「月次抽出依頼検索」が表示されること", () => {
    window.localStorage.setItem("login-user-id", "test-userA");

    render(<PortalPage />);

    const links = screen.getAllByTestId("link-card-mock");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("月次抽出依頼検索");
    expect(links[0]).toHaveAttribute("href", "/extraction-status");
  });

  it("test-userBでログインしている場合、「メタデータ参照・登録」と「データプロファイル参照」が表示されること", () => {
    window.localStorage.setItem("login-user-id", "test-userB");

    render(<PortalPage />);

    const links = screen.getAllByTestId("link-card-mock");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("メタデータ参照・登録");
    expect(links[0]).toHaveAttribute("href", "/metadata");

    expect(links[1]).toHaveTextContent("データプロファイル参照");
    expect(links[1]).toHaveAttribute("href", "/data-profile");
  });

  it("その他のユーザーでログインしている場合、何もカードが表示されないこと", () => {
    window.localStorage.setItem("login-user-id", "test-userC");

    render(<PortalPage />);

    expect(screen.queryByTestId("link-card-mock")).not.toBeInTheDocument();
    expect(
      screen.queryByText("メニューを読み込み中..."),
    ).not.toBeInTheDocument();
  });
});
