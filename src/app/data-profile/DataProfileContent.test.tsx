import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import DataProfileContent from "./DataProfileContent";
import type { DataProfileResponse, DataProfileRow } from "./types";

function createRow(overrides: Partial<DataProfileRow> = {}): DataProfileRow {
  return {
    id: 1,
    physicalName: "patient_id",
    logicalName: "患者ID",
    maxLength: 10,
    avgLength: 8,
    distinctCount: 100,
    maxValue: 99999,
    minValue: 1,
    validRatio: "99.8%",
    invalidRatio: "0.1%",
    nullRatio: "0.1%",
    ...overrides,
  };
}

function createResponse(
  overrides: Partial<DataProfileResponse> = {},
): DataProfileResponse {
  return {
    periodFrom: "2026年4月",
    periodTo: "2026年6月",
    totalRows: 500,
    totalFiles: 100,
    categories: [
      {
        categoryId: "disease",
        label: "傷病名",
        rows: [createRow({ id: 1, physicalName: "disease_code" })],
      },
      {
        categoryId: "allergy",
        label: "薬剤・その他アレルギー等",
        rows: [createRow({ id: 2, physicalName: "allergy_code" })],
      },
    ],
    ...overrides,
  };
}

describe("DataProfileContent", () => {
  it("固定の集計対象期間を表示する", () => {
    render(
      <DataProfileContent
        data={createResponse({
          periodFrom: "2020年1月",
          periodTo: "2020年12月",
        })}
      />,
    );

    expect(screen.getByText("2026年4月", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2026年6月", { exact: false })).toBeInTheDocument();
  });

  it("合計行数・合計ファイル数をカンマ区切りで表示する", () => {
    render(
      <DataProfileContent
        data={createResponse({ totalRows: 12345, totalFiles: 6789 })}
      />,
    );

    expect(screen.getByText("合計行数：12,345件")).toBeInTheDocument();
    expect(screen.getByText("合計ファイル数：6,789件")).toBeInTheDocument();
  });

  it("カテゴリ数だけタブを表示する", () => {
    render(<DataProfileContent data={createResponse()} />);

    expect(screen.getByText("傷病名")).toBeInTheDocument();
    expect(screen.getByText("薬剤・その他アレルギー等")).toBeInTheDocument();
  });

  it("初期表示では先頭タブの行データを表示する", () => {
    render(<DataProfileContent data={createResponse()} />);

    expect(screen.getByText("disease_code")).toBeInTheDocument();
  });

  it("タブを切り替えると対応するパネルが表示状態になる", async () => {
    const user = userEvent.setup();
    render(<DataProfileContent data={createResponse()} />);

    await user.click(
      screen.getByRole("link", { name: "薬剤・その他アレルギー等" }),
    );

    const secondPanel = document.getElementById("tab-allergy");
    expect(secondPanel).not.toBeNull();
    expect(secondPanel).not.toHaveAttribute("hidden");
    expect(
      within(secondPanel as HTMLElement).getByText("allergy_code"),
    ).toBeInTheDocument();
  });
});
