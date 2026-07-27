import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DataProfilePage from "./page";

// Header モジュールのモック (必要に応じて)
vi.mock("./DataProfileLoader", () => ({
  default: () => <div data-testid="data-profile-loader">Loader Component</div>,
}));

describe("DataProfilePage", () => {
  it("タイトル 'データプロファイル参照' と DataProfileLoader が正しく表示される", () => {
    render(<DataProfilePage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "データプロファイル参照" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("data-profile-loader")).toBeInTheDocument();
  });
});
