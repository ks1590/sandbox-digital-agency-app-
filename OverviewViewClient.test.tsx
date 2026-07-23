import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataResponse } from "../../types";
import OverviewViewClient from "./OverviewViewClient";

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
      overviewText: "## 概要",
      dataTypes: [{ id: "clinical", name: "臨床情報" }],
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

describe("OverviewViewClient", () => {
  it("概要テキストがある場合は MarkdownEditor を読み取り専用で表示する", async () => {
    render(<OverviewViewClient data={createResponse()} />);

    const editor = await screen.findByTestId("markdown-editor");
    expect(editor).toHaveTextContent("## 概要");
    expect(editor).toHaveAttribute("data-readonly", "true");
  });

  it("概要テキストが空の場合は代替メッセージを表示する", () => {
    render(<OverviewViewClient data={createResponse({ overviewText: "" })} />);

    expect(screen.getByText("データがありません")).toBeInTheDocument();
    expect(screen.queryByTestId("markdown-editor")).not.toBeInTheDocument();
  });

  it("sessionStorage(metadata_clinical) に編集済みデータがあれば優先表示する", async () => {
    sessionStorage.setItem(
      "metadata_clinical",
      JSON.stringify({ overviewText: "編集済みの概要" }),
    );

    render(<OverviewViewClient data={createResponse()} />);

    const editor = await screen.findByTestId("markdown-editor");
    expect(editor).toHaveTextContent("編集済みの概要");
  });
});
