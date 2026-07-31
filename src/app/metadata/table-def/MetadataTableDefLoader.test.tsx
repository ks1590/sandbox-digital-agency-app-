import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { fetchMetadata } from "../api";
import MetadataTableDefLoader from "./MetadataTableDefLoader";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

vi.mock("../api", () => ({
  fetchMetadata: vi.fn(),
}));

vi.mock("./MetadataTableDefPageClient", () => ({
  default: vi.fn(() => <div data-testid="page-client-mock">Client Mock</div>),
}));

describe("MetadataTableDefLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態ではローディング画面が表示されること", () => {
    // 解決されないPromiseを返すことでローディング状態を維持
    (fetchMetadata as Mock).mockReturnValue(new Promise(() => {}));

    render(<MetadataTableDefLoader />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("データ取得完了後にClientコンポーネントが表示されること", async () => {
    const mockData = { overview: { status: "draft" } };
    (fetchMetadata as Mock).mockResolvedValue(mockData);

    render(<MetadataTableDefLoader />);

    await waitFor(() => {
      expect(screen.getByTestId("page-client-mock")).toBeInTheDocument();
    });

    // データフェッチがデフォルトで"臨床情報"引数付きで呼ばれたことを確認
    expect(fetchMetadata).toHaveBeenCalledWith("臨床情報");
  });

  it("fromパラメータが存在する場合、指定された種別でfetchMetadataが呼ばれること", async () => {
    const { useSearchParams } = await import("next/navigation");
    (useSearchParams as Mock).mockReturnValue({
      get: (key: string) => (key === "from" ? "検診情報" : null),
    });

    const mockData = { overview: { status: "draft" } };
    (fetchMetadata as Mock).mockResolvedValue(mockData);

    render(<MetadataTableDefLoader />);

    await waitFor(() => {
      expect(screen.getByTestId("page-client-mock")).toBeInTheDocument();
    });

    expect(fetchMetadata).toHaveBeenCalledWith("検診情報");
  });
});
