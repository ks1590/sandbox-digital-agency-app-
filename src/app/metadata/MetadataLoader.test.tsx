import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { fetchMetadata } from "./api";
import MetadataLoader from "./MetadataLoader";

vi.mock("./api", () => ({
  fetchMetadata: vi.fn(),
}));

vi.mock("./MetadataPageClient", () => ({
  default: vi.fn(() => <div data-testid="page-client-mock">Client Mock</div>),
}));

describe("MetadataLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態ではローディング画面が表示されること", () => {
    (fetchMetadata as Mock).mockReturnValue(new Promise(() => {}));
    render(<MetadataLoader />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("データ取得完了後にClientコンポーネントが表示されること", async () => {
    (fetchMetadata as Mock).mockResolvedValue({
      overview: { status: "draft" },
    });
    render(<MetadataLoader />);
    await waitFor(() => {
      expect(screen.getByTestId("page-client-mock")).toBeInTheDocument();
    });
    expect(fetchMetadata).toHaveBeenCalledTimes(1);
  });
});
