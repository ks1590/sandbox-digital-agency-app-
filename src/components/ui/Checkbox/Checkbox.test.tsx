import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox コンポーネント", () => {
  it("ラベルなしで正しくレンダリングされること", () => {
    const { container } = render(
      <Checkbox aria-label="テストチェックボックス" />,
    );
    const checkbox = screen.getByRole("checkbox", {
      name: "テストチェックボックス",
    });
    expect(checkbox).toBeInTheDocument();

    // label要素が生成されていないこと
    expect(container.querySelector("label")).toBeNull();
  });

  it("ラベル付きで正しくレンダリングされること", () => {
    const { container } = render(<Checkbox>テストラベル</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "テストラベル" });
    expect(checkbox).toBeInTheDocument();

    // label要素が生成されていること
    expect(container.querySelector("label")).toBeInTheDocument();
  });

  it("sizeとisErrorプロパティが適切に反映されること", () => {
    render(
      <Checkbox size="lg" isError>
        テストラベル
      </Checkbox>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "テストラベル" });

    expect(checkbox).toHaveAttribute("data-size", "lg");
    expect(checkbox).toHaveAttribute("data-error", "true");
  });

  it("aria-disabledがtrueの場合、クリックイベントが無効化されること", () => {
    const handleClick = vi.fn();
    render(
      <Checkbox aria-disabled="true" onClick={handleClick}>
        テストラベル
      </Checkbox>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "テストラベル" });

    // Vitest (JSDOM) では fireEvent.click だと preventDefault されても click イベントのハンドラー自体は呼ばれる可能性があるため
    // Event.defaultPrevented ではなく onClick自体がブロックされるかを確認します（コンポーネント内の実装による）
    fireEvent.click(checkbox);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("クリックイベントが正常に発火すること", () => {
    const handleClick = vi.fn();
    render(<Checkbox onClick={handleClick}>テストラベル</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "テストラベル" });

    fireEvent.click(checkbox);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("refが正しく転送されること", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref}>refテスト</Checkbox>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("checkbox");
  });
});
