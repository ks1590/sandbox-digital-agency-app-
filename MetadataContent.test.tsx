import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataResponse } from "../../types";
import MetadataContent from "./MetadataContent";

vi.mock("@/components/ui/MarkdownEditor", () => ({
  default: ({
    markdown,
    readOnly,
  }: {
    markdown: string;
    readOnly?: boolean;
  }) => (
    <div data-testid="markdown-editor" data-readonly={String(readOnly)}>
      {markdown}
    </div>
  ),
}));

function createResponse(
  overrides: Partial<MetadataResponse["overview"]> = {},
): MetadataResponse {
  return {
    overview: {
      overviewText: "## 概要テキスト",
      dataTypes: [
        { id: "clinical", name: "臨床情報" },
        { id: "document", name: "文書情報" },
      ],
      startYear: "2020",
      latestYear: "2026",
      updateFrequencies: [],
      tables: [],
      notesText: "",
      keyInfoText: "",
      ...overrides,
    },
    tableDefs: {},
  };
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MetadataContent", () => {
  it("概要テキストがある場合は MarkdownEditor を読み取り専用で表示する", async () => {
    render(<MetadataContent data={createResponse()} />);

    const editor = await screen.findByTestId("markdown-editor");
    expect(editor).toHaveTextContent("## 概要テキスト");
    expect(editor).toHaveAttribute("data-readonly", "true");
  });

  it("概要テキストが空の場合は代替メッセージを表示する", () => {
    render(<MetadataContent data={createResponse({ overviewText: "" })} />);

    expect(screen.getByText("データがありません")).toBeInTheDocument();
    expect(screen.queryByTestId("markdown-editor")).not.toBeInTheDocument();
  });

  it("データ種別ごとに詳細ページへのリンクカードを表示する", () => {
    render(<MetadataContent data={createResponse()} />);

    const clinicalLink = screen.getByRole("link", { name: "臨床情報" });
    expect(clinicalLink).toHaveAttribute(
      "href",
      "/metadata/detail?type=clinical",
    );
    const documentLink = screen.getByRole("link", { name: "文書情報" });
    expect(documentLink).toHaveAttribute(
      "href",
      "/metadata/detail?type=document",
    );
  });

  it("sessionStorage に編集済みデータがある場合はそちらを優先表示する", async () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        overviewText: "編集済みの概要",
        dataTypes: [{ id: "edited", name: "編集済み種別" }],
      }),
    );

    render(<MetadataContent data={createResponse()} />);

    const editor = await screen.findByTestId("markdown-editor");
    expect(editor).toHaveTextContent("編集済みの概要");
    expect(
      screen.getByRole("link", { name: "編集済み種別" }),
    ).toBeInTheDocument();
  });
});
