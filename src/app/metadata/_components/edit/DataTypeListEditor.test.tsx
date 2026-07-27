import { fireEvent, render, screen } from "@testing-library/react";
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

    // "new-type-"の場合は「ページを作成」ボタンが存在しない（仮登録時に作成される）
    expect(
      screen.queryByRole("button", { name: "ページを作成" }),
    ).not.toBeInTheDocument();
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
});
