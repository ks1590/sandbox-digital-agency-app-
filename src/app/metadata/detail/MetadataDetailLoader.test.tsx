import { render, screen, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { fetchMetadata } from "../api";
import MetadataDetailLoader from "./MetadataDetailLoader";

// モック
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("../api", () => ({
  fetchMetadata: vi.fn(),
}));

vi.mock("./MetadataDetailPageClient", () => ({
  default: vi.fn(({ type }) => (
    <div data-testid="detail-client">Client: {type}</div>
  )),
}));

describe("MetadataDetailLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態でローディング画面が表示され、データ取得後にClientコンポーネントが表示されること", async () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "type" ? "clinical" : null)),
    });

    const mockData = { overview: { status: "draft" } };
    (fetchMetadata as Mock).mockResolvedValue(mockData);

    render(<MetadataDetailLoader />);

    // 初期状態はローディング
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();

    // データ取得後にClientが表示されることを待機
    await waitFor(() => {
      expect(screen.getByTestId("detail-client")).toBeInTheDocument();
    });

    expect(screen.getByText("Client: clinical")).toBeInTheDocument();
    expect(fetchMetadata).toHaveBeenCalledWith("clinical");
  });

  it("typeパラメータが存在しない場合、空文字でfetchが呼ばれること", async () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn(() => null),
    });

    (fetchMetadata as Mock).mockResolvedValue({});

    render(<MetadataDetailLoader />);

    await waitFor(() => {
      expect(screen.getByTestId("detail-client")).toBeInTheDocument();
    });

    expect(screen.getByText("Client:")).toBeInTheDocument();
    expect(fetchMetadata).toHaveBeenCalledWith("");
  });
});
