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
    it("TableDefinitionLinksがレンダリングされること", () => {
      render(
        <Wrapper defaultValues={{ tables: [] }}>
          <TableDefContent />
        </Wrapper>,
      );
      expect(
        screen.getByRole("button", { name: /テーブル定義と紐づける/ }),
      ).toBeInTheDocument();
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
