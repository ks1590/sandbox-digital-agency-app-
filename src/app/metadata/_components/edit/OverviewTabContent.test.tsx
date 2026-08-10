import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OverviewTabContent from "./OverviewTabContent";

vi.mock("@/components/ui/MarkdownEditor", () => ({
  default: ({ markdown }: { markdown: string }) => (
    <div data-testid="markdown-editor">{markdown}</div>
  ),
}));

vi.mock("./DataTypeListEditor", () => ({
  default: ({ dataTypes }: { dataTypes: any[] }) => (
    <div data-testid="datatype-list-editor">
      DataTypeListEditor - Items: {dataTypes?.length || 0}
    </div>
  ),
}));


function Wrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) {
  const methods = useForm({
    defaultValues: {
      overviewText: "Initial Overview",
      dataTypes: [{ id: "test", name: "Test Type" }],
      ...defaultValues,
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("OverviewTabContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("MarkdownEditorがフォームのoverviewTextを表示する", async () => {
    render(
      <Wrapper>
        <OverviewTabContent isTopPage={true} />
      </Wrapper>,
    );

    expect(await screen.findByTestId("markdown-editor")).toHaveTextContent(
      "Initial Overview",
    );
  });

  it("記入項目のツールチップ内にトップページ用の項目が表示される", () => {
    render(
      <Wrapper>
        <OverviewTabContent isTopPage={true} />
      </Wrapper>,
    );

    expect(screen.getByText("データ説明情報")).toBeInTheDocument();
    expect(screen.getByText("キー情報")).toBeInTheDocument();
  });

  it("記入項目のツールチップ内に子ページ用の項目が表示される", () => {
    render(
      <Wrapper>
        <OverviewTabContent isTopPage={false} />
      </Wrapper>,
    );

    expect(screen.getByText("データ説明情報")).toBeInTheDocument();
    expect(screen.getByText("収集期間")).toBeInTheDocument();
    expect(screen.getByText("更新頻度")).toBeInTheDocument();
  });
});
