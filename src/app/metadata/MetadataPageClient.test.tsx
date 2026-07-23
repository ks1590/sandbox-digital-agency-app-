import { act, render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import MetadataPageClient from "./MetadataPageClient";
import type { MetadataResponse } from "./types";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("./_components/edit/MetadataEdit", () => ({
  default: vi.fn(() => <div data-testid="metadata-edit">Edit Mode</div>),
}));

vi.mock("./_components/view/MetadataContent", () => ({
  default: vi.fn(() => <div data-testid="metadata-content">View Mode</div>),
}));

vi.mock("./_components/view/PublishButtonClient", () => ({
  default: vi.fn(() => <button type="button">公開する</button>),
}));

const mockData: MetadataResponse = {
  overview: {
    overviewText: "",
    status: "draft",
    dataTypes: [],
    startYear: "2020",
    latestYear: "2024",
    updateFrequencies: [],
    tables: [],
    notesText: "",
    keyInfoText: "",
  },
  tableDefs: {},
};

describe("MetadataPageClient", () => {
  const mockRouter = { replace: vi.fn() };
  const mockPathname = "/metadata";

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue(mockPathname);
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn(() => null),
      toString: vi.fn(() => ""),
    });
  });

  it("閲覧モード（デフォルト）で正しくレンダリングされること", () => {
    render(<MetadataPageClient data={mockData} />);
    expect(screen.getByTestId("metadata-content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "編集" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "公開する" }),
    ).toBeInTheDocument();
  });

  it("編集モードで正しくレンダリングされること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "mode" ? "edit" : null)),
      toString: vi.fn(() => "mode=edit"),
    });

    render(<MetadataPageClient data={mockData} />);
    expect(screen.getByTestId("metadata-edit")).toBeInTheDocument();
  });

  it("publish_successパラメータがある場合、成功バナーが表示され5秒後にURLから削除されること", () => {
    vi.useFakeTimers();
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_success" ? "true" : null)),
      toString: vi.fn(() => "publish_success=true"),
    });

    render(<MetadataPageClient data={mockData} />);
    expect(screen.getByText("完了通知")).toBeInTheDocument();
    expect(
      screen.getByText("メタデータの公開処理が正常に完了しました。"),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/metadata?", {
      scroll: false,
    });
    vi.useRealTimers();
  });

  it("publish_errorパラメータがある場合、エラーバナーが表示されること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_error" ? "true" : null)),
      toString: vi.fn(() => "publish_error=true"),
    });

    render(<MetadataPageClient data={mockData} />);
    expect(screen.getByText("公開に失敗しました")).toBeInTheDocument();
  });
});
