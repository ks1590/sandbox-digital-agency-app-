import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "./Radio";

describe("Radio コンポーネント", () => {
  it("ラベル（children）なしで正しくレンダリングされること", () => {
    render(<Radio aria-label="テストラジオ" />);
    const radio = screen.getByRole("radio", { name: "テストラジオ" });
    expect(radio).toBeInTheDocument();
  });

  it("ラベル（children）ありで正しくレンダリングされること", () => {
    render(<Radio>オプション1</Radio>);
    const radio = screen.getByRole("radio", { name: "オプション1" });
    expect(radio).toBeInTheDocument();
    expect(screen.getByText("オプション1")).toBeInTheDocument();
  });

  it("チェック状態が正しく反映されること", () => {
    render(<Radio defaultChecked>オプション1</Radio>);
    const radio = screen.getByRole("radio", { name: "オプション1" });
    expect(radio).toBeChecked();
  });

  it("sizeプロパティが正しく反映されること", () => {
    const { container } = render(<Radio size="lg">オプション1</Radio>);
    // Radioコンポーネントは内部のspanとinputにdata-size属性を付与する
    const radioInput = screen.getByRole("radio", { name: "オプション1" });
    expect(radioInput).toHaveAttribute("data-size", "lg");
  });

  it("isErrorプロパティがtrueの場合、data-error属性が付与されること", () => {
    render(<Radio isError>オプション1</Radio>);
    const radio = screen.getByRole("radio", { name: "オプション1" });
    expect(radio).toHaveAttribute("data-error", "true");
  });

  it("クリックイベントが発火すること", () => {
    const handleClick = vi.fn();
    render(<Radio onClick={handleClick}>オプション1</Radio>);
    const radio = screen.getByRole("radio", { name: "オプション1" });

    fireEvent.click(radio);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("aria-disabledがtrueの場合、クリックイベントが無効化されること", () => {
    const handleClick = vi.fn();
    render(
      <Radio aria-disabled="true" onClick={handleClick}>
        オプション1
      </Radio>,
    );
    const radio = screen.getByRole("radio", { name: "オプション1" });

    fireEvent.click(radio);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("refが正しく転送されること", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref}>オプション1</Radio>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("radio");
  });
});
