import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import ExtractionStatusContent from "./ExtractionStatusContent";
import type { ExtractionRequest } from "./types";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const mockData: ExtractionRequest[] = [];

describe("ExtractionStatusContent", () => {
  const mockRouter = { push: vi.fn(), replace: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((_key) => null), // 初期状態で年・月は未設定
      toString: vi.fn(() => ""),
    });
  });

  it("検索ボタンはデフォルトで非活性であること", () => {
    render(<ExtractionStatusContent data={mockData} />);
    const button = screen.getByRole("button", { name: "検索" });
    expect(button).toBeDisabled();
  });

  it("年と月が入力されたら検索ボタンが活性化すること", () => {
    render(<ExtractionStatusContent data={mockData} />);
    const yearInput = screen.getByPlaceholderText("YYYY");
    const monthInput = screen.getByPlaceholderText("M");
    const button = screen.getByRole("button", { name: "検索" });

    expect(button).toBeDisabled();

    // 年を入力
    fireEvent.change(yearInput, { target: { value: "2024" } });
    expect(button).toBeDisabled(); // この時点では月が未入力なのでまだ非活性

    // 月を入力
    fireEvent.change(monthInput, { target: { value: "8" } });
    expect(button).not.toBeDisabled(); // 両方入力されたので活性化する
  });

  it("全角数字や数字以外の文字が入力された場合、数字のみが抽出・変換されること", () => {
    render(<ExtractionStatusContent data={mockData} />);
    const yearInput = screen.getByPlaceholderText("YYYY") as HTMLInputElement;
    const monthInput = screen.getByPlaceholderText("M") as HTMLInputElement;

    // 全角数字と文字の混在
    fireEvent.change(yearInput, { target: { value: "２０２４年" } });
    expect(yearInput.value).toBe("2024");

    // 全角数字と文字の混在
    fireEvent.change(monthInput, { target: { value: "０８月" } });
    expect(monthInput.value).toBe("08");

    // 完全に数字以外の文字
    fireEvent.change(yearInput, { target: { value: "abcd" } });
    expect(yearInput.value).toBe("");
  });

  it("年の入力は4桁に制限されること", () => {
    render(<ExtractionStatusContent data={mockData} />);
    const yearInput = screen.getByPlaceholderText("YYYY") as HTMLInputElement;

    // 5桁以上入力しようとしても4桁に切り捨てられる
    fireEvent.change(yearInput, { target: { value: "12345" } });
    expect(yearInput.value).toBe("1234");
  });

  it("月の入力は1〜12の範囲になるように制限されること", () => {
    render(<ExtractionStatusContent data={mockData} />);
    const monthInput = screen.getByPlaceholderText("M") as HTMLInputElement;

    // 13以上を入力すると最初の桁(1)に丸められる
    fireEvent.change(monthInput, { target: { value: "13" } });
    expect(monthInput.value).toBe("1");

    // 0や00を入力するとクリアされる
    fireEvent.change(monthInput, { target: { value: "0" } });
    expect(monthInput.value).toBe("");

    fireEvent.change(monthInput, { target: { value: "00" } });
    expect(monthInput.value).toBe("");

    // 12はそのまま入力できる
    fireEvent.change(monthInput, { target: { value: "12" } });
    expect(monthInput.value).toBe("12");

    // 3桁以上の入力は2桁目までで評価される（"123" -> "12"）
    fireEvent.change(monthInput, { target: { value: "123" } });
    expect(monthInput.value).toBe("12");
  });
});
