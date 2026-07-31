import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TableDefPage from "./page";

// Loaderのモック
vi.mock("./MetadataTableDefLoader", () => ({
  default: () => <div data-testid="loader-mock">Loader Mock</div>,
}));

describe("TableDefPage", () => {
  it("Suspenseでラップされ、Loaderコンポーネントがレンダリングされること", () => {
    render(<TableDefPage />);
    expect(screen.getByTestId("loader-mock")).toBeInTheDocument();
  });
});
