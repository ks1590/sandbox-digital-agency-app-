import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input コンポーネント", () => {
  it("デフォルトの設定で正しくレンダリングされること", () => {
    render(<Input placeholder="入力してください" />);
    const input = screen.getByPlaceholderText("入力してください");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-size", "lg"); // デフォルトのblockSize
  });

  it("blockSizeプロパティが正しく適用されること", () => {
    const { rerender } = render(<Input placeholder="入力" blockSize="sm" />);
    let input = screen.getByPlaceholderText("入力");
    expect(input).toHaveAttribute("data-size", "sm");

    rerender(<Input placeholder="入力" blockSize="md" />);
    input = screen.getByPlaceholderText("入力");
    expect(input).toHaveAttribute("data-size", "md");
  });

  it("isErrorプロパティがtrueの場合、aria-invalidが付与されること", () => {
    render(<Input isError placeholder="エラー入力" />);
    const input = screen.getByPlaceholderText("エラー入力");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-disabledがtrueの場合、readOnlyプロパティが適用されること", () => {
    render(<Input aria-disabled="true" placeholder="無効化" />);
    const input = screen.getByPlaceholderText("無効化");
    expect(input).toHaveAttribute("readonly");
  });

  it("readOnlyプロパティが明示された場合、readOnlyとして扱われること", () => {
    render(<Input readOnly placeholder="読み取り専用" />);
    const input = screen.getByPlaceholderText("読み取り専用");
    expect(input).toHaveAttribute("readonly");
  });

  it("追加のclassNameが正しく結合されること", () => {
    render(<Input className="custom-class" placeholder="カスタム" />);
    const input = screen.getByPlaceholderText("カスタム");
    expect(input).toHaveClass("custom-class");
  });

  it("refが正しく転送されること", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="refテスト" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
