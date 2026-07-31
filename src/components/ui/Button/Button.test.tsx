import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button コンポーネント", () => {
  it("正しくレンダリングされること", () => {
    render(<Button size="md">ボタン</Button>);
    const button = screen.getByRole("button", { name: "ボタン" });
    expect(button).toBeInTheDocument();
  });

  it("variantとsizeのスタイルクラスが適用されること", () => {
    const { container } = render(
      <Button size="lg" variant="solid-fill">
        ボタン
      </Button>,
    );
    const button = container.firstChild as HTMLElement;
    // buttonSizeStyle["lg"]の一部が含まれているか
    expect(button.className).toContain("min-w-[calc(136/16*1rem)]");
    // buttonVariantStyle["solid-fill"]の一部が含まれているか
    expect(button.className).toContain("bg-key-900");
  });

  it("aria-disabledがtrueの場合、デフォルトのクリック動作がキャンセルされること", () => {
    render(
      <Button size="md" aria-disabled="true">
        ボタン
      </Button>,
    );
    const button = screen.getByRole("button", { name: "ボタン" });

    // onClickを渡さない場合は内部のhandleDisabledが設定されるため、preventDefaultが呼ばれるか確認
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    vi.spyOn(event, "preventDefault");
    fireEvent(button, event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("クリックイベントが正常に発火すること", () => {
    const handleClick = vi.fn();
    render(
      <Button size="md" onClick={handleClick}>
        ボタン
      </Button>,
    );
    const button = screen.getByRole("button", { name: "ボタン" });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("asChildがtrueの場合、Slotを使用して子要素としてレンダリングされること", () => {
    render(
      <Button size="md" asChild>
        <a href="/test">リンクボタン</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "リンクボタン" });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/test");
  });

  it("refが正しく転送されること", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button size="md" ref={ref}>
        refテスト
      </Button>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
