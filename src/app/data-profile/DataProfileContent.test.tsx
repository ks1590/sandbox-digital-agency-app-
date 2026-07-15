import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DataProfileContent from "./DataProfileContent";
import type { DataProfileResponse } from "./types";

const mockData: DataProfileResponse = {
  periodFrom: "2026年4月",
  periodTo: "2026年6月",
  totalRows: 500,
  totalFiles: 100,
  categories: [
    {
      categoryId: "disease",
      label: "傷病名",
      rows: [
        {
          id: 1,
          physicalName: "傷病名_1_physical",
          logicalName: "傷病名_1_logical",
          maxLength: 10,
          avgLength: 10,
          distinctCount: 100,
          maxValue: 99999,
          minValue: 1,
          validRatio: "99.8%",
          invalidRatio: "0.1%",
          nullRatio: "0.1%",
        },
      ],
    },
    {
      categoryId: "allergy",
      label: "薬剤・その他アレルギー等",
      rows: [],
    },
  ],
};

describe("DataProfileContent", () => {
  it("集計対象期間と合計件数が正しく表示されること", () => {
    render(<DataProfileContent data={mockData} />);

    expect(screen.getByText(/2026年4月/)).toBeInTheDocument();
    expect(screen.getByText(/2026年6月/)).toBeInTheDocument();
    expect(screen.getByText(/合計行数：500件/)).toBeInTheDocument();
    expect(screen.getByText(/合計ファイル数：100件/)).toBeInTheDocument();
  });

  it("カテゴリタブが表示されること", () => {
    render(<DataProfileContent data={mockData} />);

    expect(screen.getByText("傷病名")).toBeInTheDocument();
    expect(screen.getByText("薬剤・その他アレルギー等")).toBeInTheDocument();
  });

  it("データプロファイル行が正しくレンダリングされること", () => {
    render(<DataProfileContent data={mockData} />);

    expect(screen.getByText("傷病名_1_physical")).toBeInTheDocument();
    expect(screen.getByText("99.8%")).toBeInTheDocument();
  });
});
