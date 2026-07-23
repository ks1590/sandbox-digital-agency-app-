import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MetadataDetailPage from "./page";

vi.mock("./MetadataDetailLoader", () => ({
  default: vi.fn(() => <div data-testid="loader">Loader</div>),
}));

describe("MetadataDetailPage", () => {
  it("SuspenseでラップされたMetadataDetailLoaderをレンダリングすること", () => {
    render(<MetadataDetailPage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
