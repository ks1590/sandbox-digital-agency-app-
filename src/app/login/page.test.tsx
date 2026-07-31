import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

// モック
vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header-mock">Header</header>,
}));

vi.mock("./LoginForm", () => ({
  default: () => <div data-testid="login-form-mock">Login Form</div>,
}));

describe("LoginPage", () => {
  it("ログインページが正しくレンダリングされること", () => {
    render(<LoginPage />);

    // ヘッダーが表示されていること
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();

    // タイトルが表示されていること
    expect(screen.getByRole("heading", { level: 2, name: "ログイン" })).toBeInTheDocument();

    // ログインフォームコンポーネントが表示されていること
    expect(screen.getByTestId("login-form-mock")).toBeInTheDocument();
  });
});
