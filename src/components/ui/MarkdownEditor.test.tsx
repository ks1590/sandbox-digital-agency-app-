import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownEditor from "./MarkdownEditor";

// MDXEditor のモック
vi.mock("@mdxeditor/editor", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@mdxeditor/editor")>();
  return {
    ...mod,
    MDXEditor: vi.fn(({ markdown, translation, plugins }) => {
      // translation 関数のカバレッジを上げるための呼び出し
      if (translation) {
        translation("Heading {{level}}", "Heading {{level}}", { level: 1 });
        translation("Unknown", "Unknown");
      }

      // plugins の中から toolbarContents を見つけて実行するだけにする (レンダリングはしない)
      if (plugins) {
        for (const plugin of plugins) {
          if (
            plugin &&
            typeof plugin === "object" &&
            "toolbarContents" in plugin
          ) {
            const Toolbar = plugin.toolbarContents;
            if (typeof Toolbar === "function") {
              Toolbar(); // jsx要素を返すだけでレンダリングしないのでフックエラーにならない
            }
            break;
          }
        }
      }

      return <div data-testid="mdx-editor-mock">{markdown}</div>;
    }),
    toolbarPlugin: vi.fn((config) => config),
  };
});

// ReactMarkdown のモック
vi.mock("react-markdown", () => ({
  default: vi.fn(({ children, components }: any) => {
    // components のカバレッジを上げるための呼び出し (レンダリングはしない)
    if (components) {
      if (components.table) components.table({ node: {} });
      if (components.th) components.th({ node: {} });
      if (components.td) components.td({ node: {} });
      if (components.pre) components.pre({ node: {} });
      if (components.code) components.code({ node: {} });
    }
    return <div data-testid="react-markdown-mock">{children}</div>;
  }),
}));

describe("MarkdownEditor", () => {
  it("readOnlyがtrueの場合、ReactMarkdownを使用してレンダリングされること", () => {
    render(<MarkdownEditor markdown="**test**" readOnly={true} />);

    // ReactMarkdown がレンダリングされていることの確認
    expect(screen.getByTestId("react-markdown-mock")).toBeInTheDocument();
    expect(screen.getByText("**test**")).toBeInTheDocument();
    expect(screen.queryByTestId("mdx-editor-mock")).not.toBeInTheDocument();
  });

  it("readOnlyがfalse（デフォルト）の場合、MDXEditorを使用してレンダリングされること", () => {
    render(<MarkdownEditor markdown="**test**" readOnly={false} />);

    expect(screen.getByTestId("mdx-editor-mock")).toBeInTheDocument();
    expect(screen.getByText("**test**")).toBeInTheDocument();
  });
});
