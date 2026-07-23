import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MetadataPage from "./page";

vi.mock("./MetadataLoader", () => ({
  default: () => <div data-testid="loader-mock">Loader Mock</div>,
}));

describe("MetadataPage", () => {
  it("Suspenseでラップされ、Loaderコンポーネントがレンダリングされること", () => {
    render(<MetadataPage />);
    expect(screen.getByTestId("loader-mock")).toBeInTheDocument();
  });
});
