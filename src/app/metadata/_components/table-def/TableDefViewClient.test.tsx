import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MetadataResponse, TableDefRow } from "../../types";
import { TableDefTable } from "./TableDefViewClient";

function createRow(overrides: Partial<TableDefRow> = {}): TableDefRow {
  return {
    id: 1,
    physicalName: "patient_id",
    dataType: "string",
    length: 10,
    required: "必須",
    logicalName: "患者ID",
    description: "患者の識別子",
    foreignKey: "いいえ",
    masterType: "",
    sampleData: "12345",
    ...overrides,
  };
}

function createResponse(
  tableDefs: MetadataResponse["tableDefs"] = {},
): MetadataResponse {
  return {
    overview: {
      overviewText: "",
      dataTypes: [],
      startYear: "",
      latestYear: "",
      updateFrequencies: [],
      tables: [],
      notesText: "",
      keyInfoText: "",
    },
    tableDefs,
  };
}

beforeEach(() => {
  sessionStorage.clear();
});

describe("TableDefTable", () => {
  it("指定した subtab の行データを表示する", () => {
    const data = createResponse({
      condtion_table: [
        createRow({ id: 1, physicalName: "disease_code" }),
        createRow({ id: 2, physicalName: "onset_date" }),
      ],
    });

    render(<TableDefTable subtab="condtion_table" data={data} />);

    expect(screen.getByText("disease_code")).toBeInTheDocument();
    expect(screen.getByText("onset_date")).toBeInTheDocument();
  });

  it("対象 subtab のデータが無い場合は行を表示しない", () => {
    const data = createResponse({
      condtion_table: [createRow({ physicalName: "disease_code" })],
    });

    render(<TableDefTable subtab="unknown_table" data={data} />);

    expect(screen.queryByText("disease_code")).not.toBeInTheDocument();
  });

  it("sessionStorage の編集済みデータがあれば優先表示する", () => {
    const data = createResponse({
      condtion_table: [createRow({ physicalName: "api_value" })],
    });
    sessionStorage.setItem(
      "metadata_clinical",
      JSON.stringify({
        tableDefs: {
          condtion_table: [createRow({ physicalName: "session_value" })],
        },
      }),
    );

    render(<TableDefTable subtab="condtion_table" data={data} />);

    expect(screen.getByText("session_value")).toBeInTheDocument();
    expect(screen.queryByText("api_value")).not.toBeInTheDocument();
  });

  it("論理名や項目説明などのカラム値を表示する", () => {
    const data = createResponse({
      condtion_table: [
        createRow({
          logicalName: "傷病名コード",
          description: "ICD-10コード",
          dataType: "varchar",
        }),
      ],
    });

    render(<TableDefTable subtab="condtion_table" data={data} />);

    const table = screen.getByRole("table");
    expect(within(table).getByText("傷病名コード")).toBeInTheDocument();
    expect(within(table).getByText("ICD-10コード")).toBeInTheDocument();
    expect(within(table).getByText("varchar")).toBeInTheDocument();
  });

  it("sessionStorage が不正な JSON でもエラーにならず API データを表示する", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const data = createResponse({
      condtion_table: [createRow({ physicalName: "api_value" })],
    });
    sessionStorage.setItem("metadata_clinical", "{invalid");

    render(<TableDefTable subtab="condtion_table" data={data} />);

    expect(screen.getByText("api_value")).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });
});
