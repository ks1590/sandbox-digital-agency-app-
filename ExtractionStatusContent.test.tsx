import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ExtractionStatusContent from "./ExtractionStatusContent";
import type { ExtractionRequest } from "./types";

// next/navigation のモック
const pushMock = vi.fn();
let searchParamsMap = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParamsMap,
}));

function createRequest(
  overrides: Partial<ExtractionRequest> = {},
): ExtractionRequest {
  return {
    requestId: "req-1",
    receptionId: "rec-1",
    dataCategory: "分類A",
    dataProvisionMethod: "方法A",
    extractionDataInfo: '{"table":"users"}',
    extractionStatus: "完了",
    receptionTimestamp: "2026-05-15T10:30:00",
    receptionStatus: "受付済",
    completionTimestamp: "2026-05-15T11:00:00",
    resultStatus: "正常終了",
    processingTime: "30分",
    processingTimeSeconds: 1800,
    ...overrides,
  };
}

const data: ExtractionRequest[] = [
  createRequest({ requestId: "a", receptionTimestamp: "2026-05-15T10:00:00" }),
  createRequest({ requestId: "b", receptionTimestamp: "2026-06-20T10:00:00" }),
  createRequest({ requestId: "c", receptionTimestamp: "2025-05-01T10:00:00" }),
];

beforeEach(() => {
  pushMock.mockClear();
  searchParamsMap = new URLSearchParams();
  // jsdom は <dialog> の showModal/close を実装していないためスタブ化する
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("ExtractionStatusContent", () => {
  it("初期表示は当月が設定され、該当0件ならメッセージを表示する", () => {
    const invalidDateData: ExtractionRequest[] = [
      createRequest({ requestId: "x", receptionTimestamp: "invalid-date" }),
    ];

    render(<ExtractionStatusContent data={invalidDateData} />);

    const [yearInput, monthInput] = screen.getAllByRole("textbox");

    expect(screen.getByText("総件数：0件")).toBeInTheDocument();
    expect(screen.getByText("該当データがありません。")).toBeInTheDocument();
    expect((yearInput as HTMLInputElement).value).toMatch(/^\d{4}$/);
    expect((monthInput as HTMLInputElement).value).toMatch(/^\d{1,2}$/);
  });

  it("年の検索条件があると該当データを表示する", () => {
    searchParamsMap = new URLSearchParams({ year: "2026" });
    render(<ExtractionStatusContent data={data} />);

    expect(screen.getByText("総件数：2件")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.queryByText("c")).not.toBeInTheDocument();
  });

  it("年月の検索条件で1件に絞り込む", () => {
    searchParamsMap = new URLSearchParams({ year: "2026", month: "5" });
    render(<ExtractionStatusContent data={data} />);

    expect(screen.getByText("総件数：1件")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("検索条件はあるが該当データがない場合はメッセージを表示する", () => {
    searchParamsMap = new URLSearchParams({ year: "2000" });
    render(<ExtractionStatusContent data={data} />);

    expect(screen.getByText("総件数：0件")).toBeInTheDocument();
    expect(screen.getByText("該当データがありません。")).toBeInTheDocument();
  });

  it("statusMessageがある場合は同じ位置に表示し、該当データなし文言は表示しない", () => {
    searchParamsMap = new URLSearchParams({ year: "2000" });
    render(<ExtractionStatusContent data={data} statusMessage="読み込み中..." />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
    expect(screen.queryByText("該当データがありません。")).not.toBeInTheDocument();
  });

  it("検索ボタンを押すとクエリパラメータ付きで遷移する", async () => {
    const user = userEvent.setup();
    render(<ExtractionStatusContent data={data} />);

    const [yearInput, monthInput] = screen.getAllByRole("textbox");
    await user.clear(yearInput);
    await user.clear(monthInput);
    await user.type(yearInput, "2026");
    await user.type(monthInput, "6");
    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(pushMock).toHaveBeenCalledWith("?year=2026&month=6");
  });

  it("抽出データ情報リンクを押すとモーダルに整形済みJSONを表示する", async () => {
    const user = userEvent.setup();
    searchParamsMap = new URLSearchParams({ year: "2026", month: "5" });
    render(<ExtractionStatusContent data={data} />);

    await user.click(screen.getByRole("button", { name: /table/ }));

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(within(dialog).getByText("抽出データ情報")).toBeInTheDocument();
  });

  it("同一requestIdが含まれていてもソート連打で行数が増えない", async () => {
    const user = userEvent.setup();
    const duplicatedRequestIdData: ExtractionRequest[] = [
      createRequest({
        requestId: "dup",
        receptionId: "rec-1",
        receptionTimestamp: "2026-05-15T10:00:00",
        processingTime: "1m45s",
        processingTimeSeconds: 105,
      }),
      createRequest({
        requestId: "dup",
        receptionId: "rec-2",
        receptionTimestamp: "2026-05-16T10:00:00",
        processingTime: "6m2.385s",
        processingTimeSeconds: 362.385,
      }),
    ];

    searchParamsMap = new URLSearchParams({ year: "2026", month: "5" });
    render(<ExtractionStatusContent data={duplicatedRequestIdData} />);

    const sortButton = screen.getByRole("button", { name: /処理時間/ });

    expect(screen.getAllByRole("row")).toHaveLength(3);

    await user.click(sortButton);
    expect(screen.getAllByRole("row")).toHaveLength(3);

    await user.click(sortButton);
    expect(screen.getAllByRole("row")).toHaveLength(3);

    await user.click(sortButton);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});
