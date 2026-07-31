"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const translationDict: Record<string, string> = {
  Bold: "太字",
  Italic: "斜体",
  Underline: "下線",
  Strikethrough: "取り消し線",
  Code: "コード",
  Link: "リンク",
  Image: "画像",
  Quote: "引用",
  "Bulleted list": "箇条書き",
  "Numbered list": "番号付きリスト",
  "Check list": "チェックリスト",
  Table: "テーブル",
  "Select block type": "ブロックの種類を選択",
  Heading: "見出し",
  Paragraph: "段落",
  "Heading 1": "見出し 1",
  "Heading 2": "見出し 2",
  "Heading 3": "見出し 3",
  "Heading 4": "見出し 4",
  "Heading 5": "見出し 5",
  "Heading 6": "見出し 6",
  "Code block": "コードブロック",
  "Insert code block": "コードブロックを挿入",
  "Insert Code Block": "コードブロックを挿入",
  "Insert table": "テーブルを挿入",
  "Insert Table": "テーブルを挿入",
  "Insert link": "リンクを挿入",
  "Create link": "リンクを作成",
  "Create Link": "リンクを作成",
  "Insert image": "画像を挿入",
  "Insert Thematic Break": "区切り線を挿入",
  "Insert thematic break": "区切り線を挿入",
  Save: "保存",
  Cancel: "キャンセル",
  Edit: "編集",
  Remove: "削除",
  URL: "URL",
  "Alt text": "代替テキスト",
  Title: "タイトル",
  "Open in new tab": "新しいタブで開く",
  "Block type": "段落/見出し",
  "Heading {{level}}": "見出し {{level}}",
};

const jaTranslation = (
  key: string,
  defaultValue: string,
  interpolations?: Record<string, any>,
) => {
  let translated = translationDict[defaultValue] || defaultValue;
  if (interpolations) {
    for (const [k, v] of Object.entries(interpolations)) {
      translated = translated.replace(new RegExp(`{{${k}}}`, "g"), String(v));
    }
  }
  return translated;
};

// Next.js dynamic import 用に default export するためのラッパー
export default forwardRef<MDXEditorMethods, MDXEditorProps>(
  function MarkdownEditor(props, ref) {
    if (props.readOnly) {
      return (
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              table: ({ node, ...props }) => (
                <table
                  className="border-collapse border border-gray-300 w-full my-4"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-gray-300 px-4 py-2 bg-white text-left font-semibold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-gray-300 px-4 py-2" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  className="!bg-white !text-gray-900 border border-gray-300 p-4 rounded-md my-4 overflow-auto"
                  {...props}
                />
              ),
              code: ({ node, ...props }) => (
                <code className="!bg-transparent !text-inherit" {...props} />
              ),
            }}
          >
            {props.markdown}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="border border-gray-400 rounded-md bg-white">
        <MDXEditor
          ref={ref}
          translation={jaTranslation}
          contentEditableClassName="prose max-w-none p-4 min-h-[33vh] outline-none"
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <div className="flex flex-wrap items-center gap-1">
                  <BlockTypeSelect />
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <BoldItalicUnderlineToggles />
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <ListsToggle />
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <CreateLink />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                </div>
              ),
            }),
            headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            codeBlockPlugin({ codeBlockEditorDescriptors: [] }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                "": "コードブロック",
              },
            }),
            ...(props.plugins || []),
          ]}
          {...props}
        />
      </div>
    );
  },
);
