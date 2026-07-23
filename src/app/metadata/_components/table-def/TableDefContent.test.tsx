import { render, screen, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import TableDefContent, { TableDefGrid } from "./TableDefContent";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("./TextPopover", () => ({
  default: ({ text }: { text: string }) => (
    <span data-testid="text-popover">{text}</span>
  ),
}));

const Wrapper = ({ children, defaultValues = {} }: any) => {
  const methods = useForm({
    defaultValues,
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("TableDefContent.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue("/mock-path");
  });

  describe("TableDefContent component", () => {
    it("テーブルがない場合、メッセージが表示されること", () => {
      render(
        <Wrapper defaultValues={{ tables: [] }}>
          <TableDefContent />
        </Wrapper>,
      );
      expect(
        screen.getByText(
          "テーブル定義が紐付けられていません。「概要」タブでテーブルを追加してください。",
        ),
      ).toBeInTheDocument();
    });

    it("テーブルがある場合、LinkCardが表示されること", () => {
      render(
        <Wrapper
          defaultValues={{
            tables: [
              {
                id: "1",
                physicalName: "test_table",
                logicalName: "テストテーブル",
              },
              { id: "2", physicalName: "no_logical_table", logicalName: "" },
              { id: "3", physicalName: "" }, // 物理名がない場合は表示されない
            ],
          }}
        >
          <TableDefContent />
        </Wrapper>,
      );

      // logicalName がある場合
      expect(
        screen.getByRole("link", { name: "テストテーブル" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "テストテーブル" }),
      ).toHaveAttribute(
        "href",
        "/mock-path?mode=edit&tab=table-def&subtab=test_table",
      );

      // logicalName がない場合 (physicalName が表示される)
      expect(
        screen.getByRole("link", { name: "no_logical_table" }),
      ).toBeInTheDocument();

      // 物理名がないものは表示されない
      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(2);
    });
  });

  describe("TableDefGrid component", () => {
    it("初期データがない場合、ダミーデータが追加されること", async () => {
      render(
        <Wrapper defaultValues={{ tableDefs: { test_subtab: [] } }}>
          <TableDefGrid subtab="test_subtab" />
        </Wrapper>,
      );

      await waitFor(() => {
        const inputs = screen.getAllByLabelText(/論理名/);
        expect(inputs.length).toBeGreaterThan(0);
      });

      // 10件のダミーデータが追加されていること（ヘッダー行を含め11行になるはず）
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(11);
    });

    it("既存データがある場合、そのデータが表示されること", () => {
      render(
        <Wrapper
          defaultValues={{
            tableDefs: {
              test_subtab: [
                {
                  id: 999,
                  physicalName: "existing_col",
                  dataType: "INTEGER",
                  length: 10,
                  required: "任意",
                  logicalName: "既存カラム",
                  description: "説明",
                  foreignKey: "いいえ",
                  masterType: "",
                  sampleData: "123",
                },
              ],
            },
          }}
        >
          <TableDefGrid subtab="test_subtab" />
        </Wrapper>,
      );

      // 既存データが表示されていること
      const inputs = screen.getAllByDisplayValue("既存カラム");
      expect(inputs).toHaveLength(1);

      // ダミーデータは追加されていないこと
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(2); // ヘッダーと1行のデータ
    });
  });
});
