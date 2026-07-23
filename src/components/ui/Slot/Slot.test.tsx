import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Slot } from "./Slot";

describe("Slot コンポーネント", () => {
  it("単一のReact要素の子要素をレンダリングし、Propsをマージすること", () => {
    render(
      <Slot className="parent-class" data-testid="slot-child" aria-label="slot">
        <div className="child-class" id="child">
          子要素
        </div>
      </Slot>,
    );

    const child = screen.getByTestId("slot-child");
    expect(child).toBeInTheDocument();
    expect(child.tagName).toBe("DIV");
    expect(child).toHaveTextContent("子要素");
    expect(child).toHaveAttribute("id", "child");
    expect(child).toHaveAttribute("aria-label", "slot");
    // classNameがマージされること
    expect(child).toHaveClass("parent-class", "child-class");
  });

  it("複数の子要素がある場合はエラーをスローすること", () => {
    // 開発モードでChildren.onlyが失敗するケース
    expect(() => {
      render(
        <Slot>
          <div>子要素1</div>
          <div>子要素2</div>
        </Slot>,
      );
    }).toThrow();
  });

  it("テキストノードなどの有効な要素でない場合はnullを返すこと", () => {
    const { container } = render(<Slot>テキストのみ</Slot>);
    expect(container).toBeEmptyDOMElement();
  });
});
