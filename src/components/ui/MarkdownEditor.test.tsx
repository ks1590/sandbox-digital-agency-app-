import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownEditor from "./MarkdownEditor";

// MDXEditor のモック
vi.mock("@mdxeditor/editor", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@mdxeditor/editor")>();
  return {
    ...mod,
    MDXEditor: vi.fn(({ markdown }) => (
      <div data-testid="mdx-editor-mock">{markdown}</div>
    )),
  };
});

// ReactMarkdown のモック
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-markdown-mock">{children}</div>
  ),
}));

describe("MarkdownEditor", () => {
  it("readOnlyがtrueの場合、ReactMarkdownを使用してレンダリングされること", () => {
    render(<MarkdownEditor markdown="**test**" readOnly={true} />);

    expect(screen.getByTestId("react-markdown-mock")).toBeInTheDocument();
    expect(screen.getByText("**test**")).toBeInTheDocument();
    expect(screen.queryByTestId("mdx-editor-mock")).not.toBeInTheDocument();
  });

  it("readOnlyがfalse（デフォルト）の場合、MDXEditorを使用してレンダリングされること", () => {
    render(<MarkdownEditor markdown="**test**" readOnly={false} />);

    expect(screen.getByTestId("mdx-editor-mock")).toBeInTheDocument();
    expect(screen.getByText("**test**")).toBeInTheDocument();
    expect(screen.queryByTestId("react-markdown-mock")).not.toBeInTheDocument();
  });
});
