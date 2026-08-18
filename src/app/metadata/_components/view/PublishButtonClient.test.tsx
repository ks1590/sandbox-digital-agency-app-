import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublishButtonClient from "./PublishButtonClient";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/metadata",
  useSearchParams: () => new URLSearchParams(),
}));

describe("PublishButtonClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.removeAttribute("open");
    });
  });

  it("変更がない状態では公開ボタンを表示しない", () => {
    render(<PublishButtonClient />);
    expect(
      screen.queryByRole("button", { name: "公開" }),
    ).not.toBeInTheDocument();
  });

  it("変更がある状態で公開ボタンを表示し、クリックすると一文形式で変更内容を表示する", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "更新された概要",
      }),
    );
    sessionStorage.setItem(
      "metadata_臨床情報",
      JSON.stringify({
        startYear: "2025",
      }),
    );

    render(<PublishButtonClient />);

    const openButton = screen.getByRole("button", { name: "公開" });
    expect(openButton).toBeInTheDocument();

    fireEvent.click(openButton);

    expect(screen.getByTestId("publish-change-list")).toBeInTheDocument();
    expect(
      screen.getByText("データベース全体に関する情報を編集しました"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("収集開始年度を「2020」から「2025」へ変更しました"),
    ).toBeInTheDocument();
  });

  it("背景（バックドロップ）をクリックしてもダイアログは閉じない", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "更新された概要",
      }),
    );

    const { container } = render(<PublishButtonClient />);

    const openButton = screen.getByRole("button", { name: "公開" });
    fireEvent.click(openButton);

    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    const closeSpy = vi.spyOn(dialog, "close");

    fireEvent.click(dialog);

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("キャンセルボタンを押すとダイアログを閉じる", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "更新された概要",
      }),
    );

    render(<PublishButtonClient />);

    const openButton = screen.getByRole("button", { name: "公開" });
    fireEvent.click(openButton);

    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    fireEvent.click(cancelButton);

    expect(closeSpy).toHaveBeenCalled();
  });

  it("公開するボタンを押すと router.push が呼ばれる", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "更新された概要",
      }),
    );

    render(<PublishButtonClient />);

    const openButton = screen.getByRole("button", { name: "公開" });
    fireEvent.click(openButton);

    const submitButton = screen.getByRole("button", { name: "公開する" });
    fireEvent.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringMatching(/^\/metadata\?publish_(success|error)=true$/),
    );
  });

  it("公開が成功した場合、sessionStorageのメタデータがクリアされ公開ボタンが非表示になる", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "更新された概要",
      }),
    );
    sessionStorage.setItem(
      "metadata_臨床情報",
      JSON.stringify({
        startYear: "2025",
      }),
    );

    // Math.random() をモックして成功ルート（> 0.5）を通す
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const { rerender } = render(<PublishButtonClient />);

    const openButton = screen.getByRole("button", { name: "公開" });
    expect(openButton).toBeInTheDocument();
    fireEvent.click(openButton);

    const submitButton = screen.getByRole("button", { name: "公開する" });
    fireEvent.click(submitButton);

    expect(sessionStorage.getItem("metadata_top")).toBeNull();
    expect(sessionStorage.getItem("metadata_臨床情報")).toBeNull();

    // 再レンダリング後、公開ボタンが表示されないこと
    rerender(<PublishButtonClient />);
    expect(
      screen.queryByRole("button", { name: "公開" }),
    ).not.toBeInTheDocument();

    vi.spyOn(Math, "random").mockRestore();
  });
});
