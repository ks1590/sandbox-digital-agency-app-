import { act, render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type { MetadataResponse } from "../types";
import MetadataDetailPageClient from "./MetadataDetailPageClient";

// 必要なモックの定義
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("../_components/edit/MetadataEdit", () => ({
  default: vi.fn(() => <div data-testid="metadata-edit">Metadata Edit</div>),
}));

vi.mock("../_components/view/OverviewViewClient", () => ({
  default: vi.fn(() => <div data-testid="overview-view">Overview View</div>),
}));

vi.mock("../_components/view/PublishButtonClient", () => ({
  default: vi.fn(() => <button type="button">公開する</button>),
}));

const mockData: MetadataResponse = {
  overview: {
    overviewText: "",
    status: "draft",
    dataTypes: [{ id: "clinical", name: "臨床データ" }],
    startYear: "2020",
    latestYear: "2024",
    updateFrequencies: [],
    tables: [
      { id: "1", physicalName: "patient_table", logicalName: "患者テーブル", overview: "患者の基本情報", unit: "人" },
    ],
    notesText: "",
    keyInfoText: "",
  },
  tableDefs: {},
};

describe("MetadataDetailPageClient", () => {
  const mockRouter = { replace: vi.fn() };
  const mockPathname = "/metadata/detail";

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue(mockPathname);

    // デフォルトの検索パラメータ
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((_key) => null),
      toString: vi.fn(() => ""),
    });
  });

  it("mode=editの場合はMetadataEditコンポーネントを表示すること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "mode" ? "edit" : null)),
    });

    render(<MetadataDetailPageClient data={mockData} type="clinical" />);
    expect(screen.getByTestId("metadata-edit")).toBeInTheDocument();
    expect(screen.queryByText("データ種別")).not.toBeInTheDocument();
  });

  it("通常モードでタブと基本情報が正しく表示されること", () => {
    render(<MetadataDetailPageClient data={mockData} type="clinical" />);

    expect(screen.getByText("メタデータ")).toBeInTheDocument();
    expect(screen.getByText("臨床データ")).toBeInTheDocument(); // getDataTypeNameの解決結果
    expect(screen.getByRole("link", { name: "編集" })).toBeInTheDocument();
    expect(screen.getByTestId("overview-view")).toBeInTheDocument();
  });

  it("ステータスがdraftの場合は公開ボタンが表示されること", () => {
    render(<MetadataDetailPageClient data={mockData} type="clinical" />);
    expect(
      screen.getByRole("button", { name: "公開する" }),
    ).toBeInTheDocument();
  });

  it("ステータスがpublishedの場合は公開ボタンが表示されないこと", () => {
    const publishedData = {
      ...mockData,
      overview: { ...mockData.overview, status: "published" as const },
    };
    render(<MetadataDetailPageClient data={publishedData} type="clinical" />);
    expect(
      screen.queryByRole("button", { name: "公開する" }),
    ).not.toBeInTheDocument();
  });

  it("publish_successパラメータがある場合、成功バナーが表示され5秒後にURLから削除されること", async () => {
    vi.useFakeTimers();
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_success" ? "true" : null)),
      toString: vi.fn(() => "publish_success=true"),
    });

    render(<MetadataDetailPageClient data={mockData} type="clinical" />);

    expect(screen.getByText("完了通知")).toBeInTheDocument();
    expect(
      screen.getByText("メタデータの公開処理が正常に完了しました。"),
    ).toBeInTheDocument();

    // 5秒経過させる
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/metadata/detail?", {
      scroll: false,
    });

    vi.useRealTimers();
  });

  it("publish_errorパラメータがある場合、エラーバナーが表示されること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_error" ? "true" : null)),
    });

    render(<MetadataDetailPageClient data={mockData} type="clinical" />);
    expect(screen.getByText("公開に失敗しました")).toBeInTheDocument();
  });

  it("テーブル定義タブでLinkCardが表示されること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "tab" ? "table-def" : null)),
    });

    render(<MetadataDetailPageClient data={mockData} type="clinical" />);
    expect(
      screen.getByRole("link", { name: "患者テーブル" }),
    ).toBeInTheDocument();
  });

  it("テーブルが紐付いていない場合、テーブル定義タブでメッセージが表示されること", () => {
    const emptyTablesData = {
      ...mockData,
      overview: { ...mockData.overview, tables: [] },
    };
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "tab" ? "table-def" : null)),
    });

    render(<MetadataDetailPageClient data={emptyTablesData} type="clinical" />);
    expect(
      screen.getByText("テーブル定義が紐付けられていません。"),
    ).toBeInTheDocument();
  });
});
