import { act, render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type { MetadataResponse } from "../types";
import MetadataTableDefPageClient from "./MetadataTableDefPageClient";

// Next.js Navigation Hooksのモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

// 内部コンポーネントのモック
vi.mock("../_components/table-def/TableDefContent", () => ({
  TableDefGrid: vi.fn(() => <div data-testid="table-def-grid">Grid</div>),
}));

vi.mock("../_components/table-def/TableDefViewClient", () => ({
  TableDefTable: vi.fn(() => <div data-testid="table-def-table">Table</div>),
}));

vi.mock("../_components/view/PublishButtonClient", () => ({
  default: vi.fn(() => <button type="button">公開する</button>),
}));

vi.mock("../_components/useDataTypes", () => ({
  useDataTypes: vi.fn(() => ({
    getDataTypeName: vi.fn(() => "モックデータ種別"),
  })),
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
      {
        id: "1",
        physicalName: "patient_table",
        logicalName: "患者テーブル",
        overview: "患者の基本情報",
        unit: "人",
      },
    ],
    notesText: "",
    keyInfoText: "",
  },
  tableDefs: {},
};

describe("MetadataTableDefPageClient", () => {
  const mockRouter = { replace: vi.fn() };
  const mockPathname = "/metadata/table-def";

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue(mockPathname);
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn(() => null),
      toString: vi.fn(() => ""),
    });
  });

  it("デフォルト状態（閲覧モード）で正しくレンダリングされること", () => {
    render(<MetadataTableDefPageClient data={mockData} />);

    // 編集ボタンが存在すること
    expect(screen.getByRole("link", { name: "編集" })).toBeInTheDocument();
    // 公開するボタンが存在すること
    expect(
      screen.getByRole("button", { name: "公開する" }),
    ).toBeInTheDocument();
    // データ種別が表示されること
    expect(screen.getByText("モックデータ種別")).toBeInTheDocument();
    // TableDefTableが表示されること（閲覧モード）
    expect(screen.getByTestId("table-def-table")).toBeInTheDocument();
    expect(screen.queryByTestId("table-def-grid")).not.toBeInTheDocument();
  });

  it("編集モードで正しくレンダリングされること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "mode" ? "edit" : null)),
      toString: vi.fn(() => "mode=edit"),
    });

    render(<MetadataTableDefPageClient data={mockData} />);

    // TableDefGridが表示されること（編集モード）
    expect(screen.getByTestId("table-def-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("table-def-table")).not.toBeInTheDocument();

    // 編集・公開ボタンが存在しないこと
    expect(
      screen.queryByRole("link", { name: "編集" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "公開する" }),
    ).not.toBeInTheDocument();

    // キャンセル・仮登録ボタンが存在すること
    expect(
      screen.getByRole("link", { name: "キャンセル" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "仮登録" })).toBeInTheDocument();
  });

  it("publish_successパラメータがある場合、成功バナーが表示され3秒後にURLから削除されること", () => {
    vi.useFakeTimers();
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_success" ? "true" : null)),
      toString: vi.fn(() => "publish_success=true"),
    });

    render(<MetadataTableDefPageClient data={mockData} />);

    expect(screen.getByText("完了通知")).toBeInTheDocument();
    expect(
      screen.getByText("メタデータの公開処理が正常に完了しました。"),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/metadata/table-def?", {
      scroll: false,
    });

    vi.useRealTimers();
  });

  it("publish_errorパラメータがある場合、エラーバナーが表示されること", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => (key === "publish_error" ? "true" : null)),
      toString: vi.fn(() => "publish_error=true"),
    });

    render(<MetadataTableDefPageClient data={mockData} />);

    expect(screen.getByText("公開に失敗しました")).toBeInTheDocument();
  });
});
