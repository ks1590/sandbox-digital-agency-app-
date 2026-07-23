import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TableDefinitionLinks from "./TableDefinitionLinks";

function Wrapper({
  children,
  defaultValues = { tables: [] },
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("TableDefinitionLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
