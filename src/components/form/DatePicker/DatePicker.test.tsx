import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker";

describe("DatePicker コンポーネント", () => {
  const renderDatePicker = (
    props: Partial<React.ComponentProps<typeof DatePicker>> = {},
  ) => {
    return render(
      <DatePicker {...props}>
        {({
          yearRef,
          monthRef,
          dateRef,
          readOnly,
          "aria-disabled": disabled,
          "aria-invalid": invalid,
        }) => (
          <>
            <input
              aria-label="年"
              ref={yearRef}
              readOnly={readOnly}
              aria-disabled={disabled}
              aria-invalid={invalid}
              defaultValue="2023"
            />
            <input
              aria-label="月"
              ref={monthRef}
              readOnly={readOnly}
              aria-disabled={disabled}
              aria-invalid={invalid}
              defaultValue="10"
            />
            <input
              aria-label="日"
              ref={dateRef}
              readOnly={readOnly}
              aria-disabled={disabled}
              aria-invalid={invalid}
              defaultValue="15"
            />
          </>
        )}
      </DatePicker>,
    );
  };

  it("正しくレンダリングされ、デフォルトの属性が付与されること", () => {
    const { container } = renderDatePicker();
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveAttribute("data-size", "lg");
    expect(screen.getByLabelText("年")).toBeInTheDocument();
    expect(screen.getByLabelText("月")).toBeInTheDocument();
    expect(screen.getByLabelText("日")).toBeInTheDocument();
  });

  it("isError, isReadonly, isDisabled が正しく伝播されること", () => {
    const { container } = renderDatePicker({
      isError: true,
      isReadonly: true,
      isDisabled: true,
    });
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveAttribute("data-error", "true");
    expect(wrapper).toHaveAttribute("data-readonly", "true");
    expect(wrapper).toHaveAttribute("data-disabled", "true");

    const yearInput = screen.getByLabelText("年");
    expect(yearInput).toHaveAttribute("aria-invalid", "true");
    expect(yearInput).toHaveAttribute("readonly");
    expect(yearInput).toHaveAttribute("aria-disabled", "true");
  });

  it("ArrowRight キーでフォーカスが移動すること", () => {
    renderDatePicker();
    const yearInput = screen.getByLabelText("年") as HTMLInputElement;
    const monthInput = screen.getByLabelText("月") as HTMLInputElement;
    const dateInput = screen.getByLabelText("日") as HTMLInputElement;

    yearInput.focus();
    // カーソルを末尾に移動
    yearInput.setSelectionRange(4, 4);

    fireEvent.keyDown(yearInput, { key: "ArrowRight" });
    expect(document.activeElement).toBe(monthInput);

    // monthでカーソルを末尾に移動して右へ
    monthInput.setSelectionRange(2, 2);
    fireEvent.keyDown(monthInput, { key: "ArrowRight" });
    expect(document.activeElement).toBe(dateInput);
  });

  it("ArrowLeft キーでフォーカスが移動すること", () => {
    renderDatePicker();
    const yearInput = screen.getByLabelText("年") as HTMLInputElement;
    const monthInput = screen.getByLabelText("月") as HTMLInputElement;
    const dateInput = screen.getByLabelText("日") as HTMLInputElement;

    dateInput.focus();
    // カーソルを先頭に移動
    dateInput.setSelectionRange(0, 0);

    fireEvent.keyDown(dateInput, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(monthInput);

    // monthでカーソルを先頭に移動して左へ
    monthInput.setSelectionRange(0, 0);
    fireEvent.keyDown(monthInput, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(yearInput);
  });

  it("数字以外の入力が防止されること", () => {
    renderDatePicker();
    const yearInput = screen.getByLabelText("年") as HTMLInputElement;

    const event = new KeyboardEvent("keydown", {
      key: "a",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    fireEvent(yearInput, event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("Ctrl/Meta 押下時のキー操作は防止されないこと", () => {
    renderDatePicker();
    const yearInput = screen.getByLabelText("年") as HTMLInputElement;

    const event = new KeyboardEvent("keydown", {
      key: "c",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    fireEvent(yearInput, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
