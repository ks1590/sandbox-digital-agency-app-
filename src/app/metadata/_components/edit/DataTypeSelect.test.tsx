import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDataTypes } from "../useDataTypes";
import DataTypeSelect from "./DataTypeSelect";

vi.mock("../useDataTypes", () => ({
  useDataTypes: vi.fn(),
}));

function Wrapper({
  children,
  defaultValues = { dataType: "clinical" },
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("DataTypeSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDataTypes).mockReturnValue({
      dataTypes: [
        { id: "clinical", name: "臨床情報" },
        { id: "genome", name: "ゲノム情報" },
      ],
      getDataTypeName: (id: string) => {
        if (id === "clinical") return "臨床情報";
        if (id === "genome") return "ゲノム情報";
        return id;
      },
    });
  });

  it("readonlyがfalseの場合、セレクトボックスが表示される", () => {
    render(
      <Wrapper>
        <DataTypeSelect readonly={false} />
      </Wrapper>,
    );

    expect(
      screen.getByRole("combobox", { name: "データ種別" }),
    ).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("臨床情報");
    expect(options[1]).toHaveTextContent("ゲノム情報");
  });

  it("readonlyがtrueの場合、選択されているデータ種別名がテキストで表示される", () => {
    render(
      <Wrapper defaultValues={{ dataType: "genome" }}>
        <DataTypeSelect readonly={true} />
      </Wrapper>,
    );

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    // label(pタグ)と値(pタグ)の2つがある
    expect(screen.getByText("データ種別")).toBeInTheDocument();
    expect(screen.getByText("ゲノム情報")).toBeInTheDocument();
  });

  it("readonlyがtrueで、未知のdataTypeが設定されている場合はそのままIDが表示される", () => {
    render(
      <Wrapper defaultValues={{ dataType: "unknown_type" }}>
        <DataTypeSelect readonly={true} />
      </Wrapper>,
    );

    expect(screen.getByText("unknown_type")).toBeInTheDocument();
  });
});
