import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type ColumnDef, DataTable } from "./DataTable";

type TestData = {
  id: number;
  name: string;
  age: number;
};

const mockData: TestData[] = [
  { id: 1, name: "User A", age: 30 },
  { id: 2, name: "User B", age: 25 },
  { id: 3, name: "User C", age: 35 },
];

const mockColumns: ColumnDef<TestData>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", sortable: true },
  { key: "age", label: "Age", sortable: true, sortValue: (row) => row.age },
  { key: "custom", label: "Custom", render: (row) => `Custom ${row.name}` },
];

describe("DataTable コンポーネント", () => {
  it("データとカラムが正しくレンダリングされること", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey={(row) => row.id}
      />,
    );

    // ヘッダーの確認
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();

    // データの確認
    expect(screen.getByText("User A")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Custom User A")).toBeInTheDocument();
  });

  it("データが空の場合、emptyMessageが表示されること", () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyMessage="データがありません"
        rowKey={(row) => row.id}
      />,
    );
    expect(screen.getByText("データがありません")).toBeInTheDocument();
  });

  it("ソート機能が正しく動作すること", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey={(row) => row.id}
      />,
    );

    const nameHeaderBtn = screen.getByRole("button", { name: /Name/ });

    // 初期状態: User A (1番目)
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("User A");

    // 1回クリック (asc)
    fireEvent.click(nameHeaderBtn);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("User A"); // A < B
    expect(rows[2]).toHaveTextContent("User B");

    // 2回クリック (desc)
    fireEvent.click(nameHeaderBtn);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("User C"); // C > B > A
    expect(rows[2]).toHaveTextContent("User B");
    expect(rows[3]).toHaveTextContent("User A");

    // 3回クリック (none)
    fireEvent.click(nameHeaderBtn);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("User A"); // 元の順序
  });

  it("ページネーションが正しく動作すること", () => {
    // 15件のデータを作成
    const manyData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20,
    }));
    render(
      <DataTable
        data={manyData}
        columns={mockColumns}
        rowKey={(row) => row.id}
        pageSizeOptions={[10, 20]}
      />,
    );

    // 最初は1ページ目（10件）
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 10")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();

    // 次のページへ
    const nextBtn = screen.getByRole("link", { name: "次のページへ進む" });
    fireEvent.click(nextBtn);

    // 2ページ目（残り5件）
    expect(screen.queryByText("User 10")).not.toBeInTheDocument();
    expect(screen.getByText("User 11")).toBeInTheDocument();
    expect(screen.getByText("User 15")).toBeInTheDocument();

    // 前のページへ
    const prevBtn = screen.getByRole("link", { name: "前のページへ戻る" });
    fireEvent.click(prevBtn);
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  it("表示件数の切り替えが正しく動作すること", () => {
    const manyData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20,
    }));
    render(
      <DataTable
        data={manyData}
        columns={mockColumns}
        rowKey={(row) => row.id}
        pageSizeOptions={[10, 20]}
      />,
    );

    // 最初は10件表示
    expect(screen.queryByText("User 15")).not.toBeInTheDocument();

    // 20件表示に切り替え
    const size20Btn = screen.getByRole("button", { name: "20件" });
    fireEvent.click(size20Btn);

    // 15件すべて表示される
    expect(screen.getByText("User 15")).toBeInTheDocument();
  });

  it("hidePageSizeOptionsがtrueの場合、表示件数オプションが非表示になること", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey={(row) => row.id}
        hidePageSizeOptions
      />,
    );
    expect(screen.queryByText("表示件数")).not.toBeInTheDocument();
  });
});
