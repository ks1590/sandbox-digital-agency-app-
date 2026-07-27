import { zodResolver } from "@hookform/resolvers/zod";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { metadataSchema } from "../schema";
import TableDefinitionLinks from "./TableDefinitionLinks";

function Wrapper({
  children,
  defaultValues = { tables: [] },
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) {
  const methods = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues,
    mode: "onChange",
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("TableDefinitionLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("初期状態で「テーブル定義と紐づける」ボタンが表示される", () => {
    render(
      <Wrapper>
        <TableDefinitionLinks />
      </Wrapper>,
    );
    expect(
      screen.getByRole("button", { name: /テーブル定義と紐づける/ }),
    ).toBeInTheDocument();
  });

  it("ボタンをクリックすると新しいテーブル行が追加される", async () => {
    render(
      <Wrapper>
        <TableDefinitionLinks />
      </Wrapper>,
    );

    const addButton = screen.getByRole("button", {
      name: /テーブル定義と紐づける/,
    });
    fireEvent.click(addButton);

    // 追加された行が表示されるか
    const selects = await screen.findAllByRole("combobox");
    expect(selects.length).toBe(1);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(1);

    // ラベルも表示されているか
    expect(screen.getByText("テーブル物理名")).toBeInTheDocument();
    expect(screen.getByText("テーブル論理名")).toBeInTheDocument();
  });

  it("行の削除ボタンをクリックすると行が削除される", async () => {
    render(
      <Wrapper
        defaultValues={{
          tables: [{ physicalName: "test", logicalName: "Test" }],
        }}
      >
        <TableDefinitionLinks />
      </Wrapper>,
    );

    const deleteButton = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteButton);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("既に選択された物理名は他の行のセレクトボックスで非表示になる", async () => {
    render(
      <Wrapper
        defaultValues={{
          tables: [
            { physicalName: "condtion_table", logicalName: "Condition" },
            { physicalName: "", logicalName: "" },
          ],
        }}
      >
        <TableDefinitionLinks />
      </Wrapper>,
    );

    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    expect(selects.length).toBe(2);

    // 1行目はcondtion_tableが選択されており、それが選択肢にある
    const options1 = Array.from(selects[0].options).map((opt) => opt.value);
    expect(options1).toContain("condtion_table");

    // 2行目はcondtion_tableが選択肢から除外されている
    const options2 = Array.from(selects[1].options).map((opt) => opt.value);
    expect(options2).not.toContain("condtion_table");
    expect(options2).toContain("allergyIntolerance_table");
  });

  it("別データ種別で選択済みの物理名も全体の選択肢から非表示になる", async () => {
    // sessionStorage に別データ種別の保存データを作成
    sessionStorage.setItem(
      "metadata_文書情報",
      JSON.stringify({
        tables: [{ physicalName: "allergyIntolerance_table", logicalName: "アレルギー" }],
      }),
    );

    render(
      <Wrapper
        defaultValues={{
          tables: [{ physicalName: "", logicalName: "" }],
        }}
      >
        <TableDefinitionLinks />
      </Wrapper>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.value);
    // 別データ種別（文書情報）で選択済みの allergyIntolerance_table は除外される
    expect(options).not.toContain("allergyIntolerance_table");
  });

  it("同じデータ種別内でテーブル論理名が重複している場合にエラーメッセージを表示する", async () => {
    let triggerFn: () => Promise<boolean>;
    const TestComponent = () => {
      const methods = useForm({
        resolver: zodResolver(metadataSchema),
        defaultValues: {
          tables: [
            {
              id: "1",
              physicalName: "condtion_table",
              logicalName: "傷病",
              overview: "",
              unit: "",
            },
            {
              id: "2",
              physicalName: "observation_table",
              logicalName: "傷病",
              overview: "",
              unit: "",
            },
          ],
        },
      });
      triggerFn = () => methods.trigger();
      return (
        <FormProvider {...methods}>
          <TableDefinitionLinks />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    await act(async () => {
      await triggerFn();
    });

    expect(
      await screen.findAllByText("テーブル論理名が重複しています"),
    ).toHaveLength(2);
  });

  it("テーブル論理名が空欄の場合にエラーメッセージを表示する", async () => {
    let triggerFn: () => Promise<boolean>;
    const TestComponent = () => {
      const methods = useForm({
        resolver: zodResolver(metadataSchema),
        defaultValues: {
          tables: [
            {
              id: "1",
              physicalName: "condtion_table",
              logicalName: "",
              overview: "",
              unit: "",
            },
          ],
        },
      });
      triggerFn = () => methods.trigger();
      return (
        <FormProvider {...methods}>
          <TableDefinitionLinks />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    await act(async () => {
      await triggerFn();
    });

    expect(
      await screen.findByText("テーブル論理名を入力してください"),
    ).toBeInTheDocument();
  });
});
