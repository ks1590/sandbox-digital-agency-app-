import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "./layout";

// Noto_Sans_JP フォントのモック
vi.mock("next/font/google", () => ({
  Noto_Sans_JP: () => ({
    variable: "mock-noto-sans-jp",
  }),
}));

// AuthGuard のモック
vi.mock("@/components/layout/AuthGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("childrenがAuthGuardの中で正しくレンダリングされること", () => {
    render(
      <RootLayout>
        <div data-testid="child">Child Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("auth-guard")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});
