import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublishButtonClient from "./PublishButtonClient";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/metadata",
  useSearchParams: () => new URLSearchParams(),
}));

describe("PublishButtonClient", () => {
  it("公開ボタンを表示する", () => {
    render(<PublishButtonClient />);

    expect(screen.getByRole("button", { name: "公開" })).toBeInTheDocument();
  });
});
