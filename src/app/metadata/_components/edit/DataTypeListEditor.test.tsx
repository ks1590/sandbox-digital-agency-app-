import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DataTypeListEditor from "./DataTypeListEditor";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("DataTypeListEditor", () => {
  const mockOnChange = vi.fn();
  const baseDataTypes = [
    { id: "type-clinical", name: "Clinical" },
    { id: "new-type-123", name: "New Type" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("データ種別リストが正しくレンダリングされる", () => {
    render(
      <DataTypeListEditor dataTypes={baseDataTypes} onChange={mockOnChange} />,
    );

    expect(screen.getByText("データ種別")).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue("Clinical");
    expect(inputs[1]).toHaveValue("New Type");

    // "type-"の場合は「詳細」リンクが表示される
    expect(screen.getByText("詳細")).toHaveAttribute(
      "href",
      "/metadata/detail?type=type-clinical&mode=edit",
    );

    // "new-type-"の場合は「ページを作成」ボタンが表示される
    expect(
      screen.getByRole("button", { name: "ページを作成" }),
    ).toBeInTheDocument();
  });

  it("データ種別を追加できる", () => {
    render(
      <DataTypeListEditor dataTypes={baseDataTypes} onChange={mockOnChange} />,
    );

    const addButton = screen.getByRole("button", {
      name: "＋ データ種別を追加",
    });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const newTypes = mockOnChange.mock.calls[0][0];
    expect(newTypes).toHaveLength(3);
    expect(newTypes[2].id).toMatch(/^new-type-\d+$/);
    expect(newTypes[2].name).toBe("");
  });

  it("データ種別を削除できる", () => {
    render(
      <DataTypeListEditor dataTypes={baseDataTypes} onChange={mockOnChange} />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const newTypes = mockOnChange.mock.calls[0][0];
    expect(newTypes).toHaveLength(1);
    expect(newTypes[0].id).toBe("new-type-123");
  });

  it("データ種別の名前を変更できる", () => {
    render(
      <DataTypeListEditor dataTypes={baseDataTypes} onChange={mockOnChange} />,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Updated Clinical" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const newTypes = mockOnChange.mock.calls[0][0];
    expect(newTypes[0].name).toBe("Updated Clinical");
  });

  it("ページを作成ボタンをクリックすると、IDが更新される", async () => {
    render(
      <DataTypeListEditor dataTypes={baseDataTypes} onChange={mockOnChange} />,
    );

    const createButton = screen.getByRole("button", { name: "ページを作成" });
    fireEvent.click(createButton);

    // ローディング中になるためボタンが無効化される
    expect(createButton).toBeDisabled();

    // 1.5秒の待機後にonChangeが呼ばれるのを待つ
    await waitFor(
      () => {
        expect(mockOnChange).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    const newTypes = mockOnChange.mock.calls[0][0];
    expect(newTypes[1].id).toBe("type-123");
  });
});
