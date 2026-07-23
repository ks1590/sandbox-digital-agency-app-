import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SubtabSection from "./SubtabSection";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../table-def/TableDefContent", () => ({
  TableDefGrid: ({ subtab }: { subtab: string }) => (
    <div data-testid="table-def-grid">{subtab}</div>
  ),
}));

function Wrapper({
  children,
  defaultValues = { tables: [] },
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("SubtabSection", () => {
  const mockRouter = {
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("テーブルが定義されていない場合はメッセージを表示する", () => {
    render(
      <Wrapper>
        <SubtabSection subtabParam="" pathname="/metadata/detail" />
      </Wrapper>,
    );

    expect(
      screen.getByText(/テーブルが定義されていません/),
    ).toBeInTheDocument();
  });

  it("有効なテーブルがある場合はタブを表示する", () => {
    render(
      <Wrapper
        defaultValues={{
          tables: [
            { physicalName: "condtion_table", logicalName: "Condition" },
            { physicalName: "observation_table", logicalName: "" },
          ],
        }}
      >
        <SubtabSection
          subtabParam="condtion_table"
          pathname="/metadata/detail"
        />
      </Wrapper>,
    );

    expect(screen.getByText("Condition")).toBeInTheDocument(); // logicalNameがある場合
    expect(screen.getAllByText("observation_table").length).toBeGreaterThan(0); // logicalNameがない場合はphysicalName
    expect(screen.getAllByTestId("table-def-grid")[0]).toHaveTextContent(
      "condtion_table",
    );
  });

  it("タブをクリックするとルーターで画面遷移する", () => {
    render(
      <Wrapper
        defaultValues={{
          tables: [
            { physicalName: "condtion_table", logicalName: "Condition" },
            { physicalName: "observation_table", logicalName: "Observation" },
          ],
        }}
      >
        <SubtabSection
          subtabParam="condtion_table"
          pathname="/metadata/detail"
        />
      </Wrapper>,
    );

    const observationTab = screen.getByText("Observation");
    fireEvent.click(observationTab);

    expect(mockRouter.push).toHaveBeenCalledWith(
      "/metadata/detail?mode=edit&tab=table-def&subtab=observation_table",
    );
  });
});
