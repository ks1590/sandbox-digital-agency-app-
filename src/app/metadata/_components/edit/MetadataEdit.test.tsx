import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataResponse } from "../../types";
import MetadataEdit from "./MetadataEdit";
import { useMetadataForm } from "./useMetadataForm";

vi.mock("./useMetadataForm", () => ({
  useMetadataForm: vi.fn(),
}));

vi.mock("./OverviewTabContent", () => ({
  default: ({ isTopPage }: { isTopPage: boolean }) => (
    <div data-testid="overview-tab">Overview {isTopPage ? "Top" : "Child"}</div>
  ),
}));

vi.mock("./ErDiagramTabContent", () => ({
  default: () => <div data-testid="er-diagram-tab">ER Diagram</div>,
}));

vi.mock("../table-def/TableDefContent", () => ({
  default: () => <div data-testid="table-def-tab">Table Def</div>,
}));

vi.mock("./DataTypeSelect", () => ({
  default: () => <div data-testid="datatype-select">DataType Select</div>,
}));

vi.mock("./EditFormFooter", () => ({
  default: () => <div data-testid="edit-form-footer">Footer</div>,
}));

vi.mock("./SubtabSection", () => ({
  default: () => <div data-testid="subtab-section">Subtab Section</div>,
}));

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

const mockApiData: MetadataResponse = {
  overview: {
    overviewText: "",
    dataTypes: [],
    startYear: "",
    latestYear: "",
    updateFrequencies: [],
    tables: [],
    notesText: "",
    keyInfoText: "",
  },
  tableDefs: {},
};

describe("MetadataEdit", () => {
  const baseUseMetadataFormReturn = {
    methods: { handleSubmit: vi.fn((fn) => fn) },
    isInitialized: true,
    notification: null,
    isTopPage: false,
    subtabParam: null,
    pathname: "/metadata/detail",
    defaultIndex: 0,
    handleSubmit: vi.fn(),
    handleTabChange: vi.fn(),
    handleCancel: vi.fn(),
    returnHref: "/metadata",
    returnText: "Back",
  } as unknown as ReturnType<typeof useMetadataForm>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期化中はローディングメッセージを表示する", () => {
    vi.mocked(useMetadataForm).mockReturnValue({
      ...baseUseMetadataFormReturn,
      isInitialized: false,
    });

    render(<MetadataEdit data={mockApiData} />);

    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();
    expect(screen.queryByTestId("overview-tab")).not.toBeInTheDocument();
  });

  it("トップページの場合はタブを表示せず、OverviewTabContentを直接表示する", () => {
    vi.mocked(useMetadataForm).mockReturnValue({
      ...baseUseMetadataFormReturn,
      isInitialized: true,
      isTopPage: true,
    });

    render(<MetadataEdit data={mockApiData} />);

    expect(screen.getByTestId("overview-tab")).toHaveTextContent(
      "Overview Top",
    );
    expect(screen.queryByTestId("datatype-select")).not.toBeInTheDocument(); // トップページでは表示されない
  });

  it("子ページの場合はDataTypeSelectとタブメニューを表示する", () => {
    vi.mocked(useMetadataForm).mockReturnValue({
      ...baseUseMetadataFormReturn,
      isInitialized: true,
      isTopPage: false,
      subtabParam: null,
    });

    render(<MetadataEdit data={mockApiData} />);

    expect(screen.getByTestId("datatype-select")).toBeInTheDocument();
    expect(screen.getByText("概要")).toBeInTheDocument();
    expect(screen.getByText("ER図")).toBeInTheDocument();
    expect(screen.getByText("テーブル定義")).toBeInTheDocument();
  });

  it("通知がある場合はNotificationBannerを表示する", () => {
    vi.mocked(useMetadataForm).mockReturnValue({
      ...baseUseMetadataFormReturn,
      isInitialized: true,
      notification: { type: "success", title: "成功", message: "保存しました" },
    });

    render(<MetadataEdit data={mockApiData} />);

    expect(screen.getByText("成功")).toBeInTheDocument();
    expect(screen.getByText("保存しました")).toBeInTheDocument();
  });

  it("subtabParamが存在する場合はSubtabSectionを表示する", () => {
    vi.mocked(useMetadataForm).mockReturnValue({
      ...baseUseMetadataFormReturn,
      isInitialized: true,
      isTopPage: false,
      subtabParam: "some_table",
    });

    render(<MetadataEdit data={mockApiData} />);

    expect(screen.getByTestId("subtab-section")).toBeInTheDocument();
    // タブはhiddenになるがDOMには存在する
    const tabContainer = screen.getByText("概要").closest("div[hidden]");
    expect(tabContainer).toHaveAttribute("hidden");
  });
});
