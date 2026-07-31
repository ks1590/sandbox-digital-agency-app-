import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TabItem } from "@/components/ui/Tab/Tab";
import MetadataViewTabs from "./MetadataViewTabs";

const replaceMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/metadata/detail",
  useSearchParams: () => searchParams,
}));

const items: TabItem[] = [
  { label: "概要", id: "tab-overview", content: <div>概要パネル</div> },
  { label: "ER図", id: "tab-er", content: <div>ER図パネル</div> },
  {
    label: "テーブル定義",
    id: "tab-table-def",
    content: <div>テーブル定義パネル</div>,
  },
];

beforeEach(() => {
  replaceMock.mockClear();
  searchParams = new URLSearchParams();
});

describe("MetadataViewTabs", () => {
  it("defaultIndex に対応するタブが初期選択される", () => {
    render(
      <MetadataViewTabs items={items} headingId="heading" defaultIndex={1} />,
    );

    expect(screen.getByRole("link", { name: "ER図" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("タブ切替時に tab クエリを付与して router.replace を呼ぶ", async () => {
    const user = userEvent.setup();
    render(
      <MetadataViewTabs items={items} headingId="heading" defaultIndex={0} />,
    );

    await user.click(screen.getByRole("link", { name: "テーブル定義" }));

    expect(replaceMock).toHaveBeenCalledWith("/metadata/detail?tab=table-def", {
      scroll: false,
    });
  });

  it("既存クエリを保持しつつ subtab を除去する", async () => {
    searchParams = new URLSearchParams({ from: "clinical", subtab: "foo" });
    const user = userEvent.setup();
    render(
      <MetadataViewTabs items={items} headingId="heading" defaultIndex={0} />,
    );

    await user.click(screen.getByRole("link", { name: "ER図" }));

    const [url] = replaceMock.mock.calls[0];
    const query = new URLSearchParams((url as string).split("?")[1]);
    expect(query.get("from")).toBe("clinical");
    expect(query.get("tab")).toBe("er");
    expect(query.has("subtab")).toBe(false);
  });

  it("tabMap を指定するとそのキーが tab クエリに使われる", async () => {
    const user = userEvent.setup();
    render(
      <MetadataViewTabs
        items={items}
        headingId="heading"
        defaultIndex={0}
        tabMap={["condtion_table", "allergy_table", "observation_table"]}
      />,
    );

    await user.click(screen.getByRole("link", { name: "テーブル定義" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/metadata/detail?tab=observation_table",
      { scroll: false },
    );
  });
});
