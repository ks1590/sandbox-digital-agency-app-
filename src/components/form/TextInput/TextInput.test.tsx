import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { TextInput } from "./TextInput";

describe("TextInput コンポーネント", () => {
  it("ラベルと入力フィールドが正しくレンダリングされること", () => {
    render(<TextInput label="お名前" placeholder="山田 太郎" />);
    expect(screen.getByText("お名前")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("山田 太郎")).toBeInTheDocument();
  });

  it("requiredがtrueの場合、「※必須」バッジが表示されること", () => {
    render(<TextInput label="お名前" required />);
    expect(screen.getByText("※必須")).toBeInTheDocument();
  });

  it("isOptionalがtrueの場合、「※任意」バッジが表示されること", () => {
    render(<TextInput label="お名前" isOptional />);
    expect(screen.getByText("※任意")).toBeInTheDocument();
  });

  it("requiredとisOptionalが両方trueの場合、「※任意」バッジが優先されること", () => {
    render(<TextInput label="お名前" required isOptional />);
    expect(screen.getByText("※任意")).toBeInTheDocument();
    expect(screen.queryByText("※必須")).not.toBeInTheDocument();
  });

  it("supportTextが提供された場合、サポートテキストが表示され、aria-describedbyで紐付けられること", () => {
    render(
      <TextInput label="お名前" supportText="フルネームで入力してください" />,
    );
    const supportText = screen.getByText("フルネームで入力してください");
    expect(supportText).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "お名前" });
    expect(input).toHaveAttribute("aria-describedby", supportText.id);
  });

  it("errorTextが提供された場合、エラーテキストが表示され、aria-invalidとaria-describedbyが設定されること", () => {
    render(<TextInput label="お名前" errorText="お名前を入力してください" />);
    const errorText = screen.getByText("お名前を入力してください");
    expect(errorText).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "お名前" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", errorText.id);
  });

  it("supportTextとerrorTextの両方がある場合、両方のIDがaria-describedbyに含まれること", () => {
    render(
      <TextInput label="お名前" supportText="サポート" errorText="エラー" />,
    );
    const supportText = screen.getByText("サポート");
    const errorText = screen.getByText("エラー");
    const input = screen.getByRole("textbox", { name: "お名前" });

    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain(supportText.id);
    expect(describedBy).toContain(errorText.id);
  });

  it("isErrorがtrueの場合、errorTextがなくてもaria-invalidが設定されること", () => {
    render(<TextInput label="お名前" isError />);
    const input = screen.getByRole("textbox", { name: "お名前" });
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("refが正しく転送されること", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextInput ref={ref} label="refテスト" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
