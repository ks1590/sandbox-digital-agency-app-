import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DataProfileLoader from "./DataProfileLoader";
import type { DataProfileResponse } from "./types";
import * as useDataProfileModule from "./useDataProfile";

vi.mock("./useDataProfile");

const mockData: DataProfileResponse = {
  periodFrom: "2026年4月",
  periodTo: "2026年6月",
  totalRows: 100,
  totalFiles: 10,
  categories: [
    {
      categoryId: "disease",
      label: "傷病名",
      rows: [],
    },
  ],
};

describe("DataProfileLoader", () => {
  it("status が loading のとき、読み込み中の表示を行う", () => {
    vi.spyOn(useDataProfileModule, "useDataProfile").mockReturnValue({
      status: "loading",
      data: null,
      error: null,
    });

    render(<DataProfileLoader />);

    const loadingElement = screen.getByRole("status");
    expect(loadingElement).toBeInTheDocument();
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("status が error のとき、エラーメッセージを表示する", () => {
    vi.spyOn(useDataProfileModule, "useDataProfile").mockReturnValue({
      status: "error",
      data: null,
      error: new Error("データ取得失敗"),
    });

    render(<DataProfileLoader />);

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();
    expect(
      screen.getByText(
        "データの取得に失敗しました。時間をおいて再度お試しください。",
      ),
    ).toBeInTheDocument();
  });

  it("status が success のとき、DataProfileContent を描画する", () => {
    vi.spyOn(useDataProfileModule, "useDataProfile").mockReturnValue({
      status: "success",
      data: mockData,
      error: null,
    });

    render(<DataProfileLoader />);

    expect(screen.getByText("集計対象期間")).toBeInTheDocument();
    expect(screen.getByText("傷病名")).toBeInTheDocument();
  });
});
