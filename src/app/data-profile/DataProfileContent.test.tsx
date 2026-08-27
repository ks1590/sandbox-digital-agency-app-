
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
    periodFrom: "2025年4月",
    periodTo: "2027年3月",
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

    expect(screen.getByText("2025年4月", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2027年3月", { exact: false })).toBeInTheDocument();
  });

  it("データ種別のセレクトボックスが表示され、選択肢が含まれる", () => {
    render(<DataProfileContent data={createResponse()} />);

    const select = screen.getByLabelText("データ種別");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("clinical");

    expect(
      screen.getByRole("option", { name: "臨床情報" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "レセプト情報" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DPC情報" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "特定健診情報" }),
    ).toBeInTheDocument();
  });

  it("データ種別を切り替えると合計行数・合計ファイル数・カテゴリタブが切り替わる", async () => {
    const user = userEvent.setup();
    render(<DataProfileContent data={createResponse()} />);

    const select = screen.getByLabelText("データ種別");

    // レセプト情報に切り替え
    await user.selectOptions(select, "receipt");
    expect(screen.getByText("合計行数：1,200件")).toBeInTheDocument();
    expect(screen.getByText("合計ファイル数：240件")).toBeInTheDocument();
    expect(screen.getByText("医科レセプト")).toBeInTheDocument();
    expect(screen.getByText("DPCレセプト")).toBeInTheDocument();
    expect(screen.getByText("調剤レセプト")).toBeInTheDocument();

    // 特定健診情報に切り替え
    await user.selectOptions(select, "checkup");
    expect(screen.getByText("合計行数：350件")).toBeInTheDocument();
    expect(screen.getByText("合計ファイル数：70件")).toBeInTheDocument();
    expect(screen.getByText("基本問診")).toBeInTheDocument();
    expect(screen.getByText("身体測定・血圧")).toBeInTheDocument();
    expect(screen.getByText("血液・尿検査")).toBeInTheDocument();
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

