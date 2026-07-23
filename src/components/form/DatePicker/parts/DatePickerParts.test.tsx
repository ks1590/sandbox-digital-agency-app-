import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { DatePickerCalendarButton } from "./DatePickerCalendarButton";
import { DatePickerDate } from "./DatePickerDate";
import { DatePickerMonth } from "./DatePickerMonth";
import { DatePickerYear } from "./DatePickerYear";

describe("DatePicker のパーツコンポーネント", () => {
  describe("DatePickerCalendarButton", () => {
    it("正しくレンダリングされること", () => {
      render(<DatePickerCalendarButton />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(screen.getByLabelText("カレンダー")).toBeInTheDocument(); // svgのaria-label
    });

    it("sizeプロパティが正しく適用されること", () => {
      const { rerender } = render(<DatePickerCalendarButton size="sm" />);
      let button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "sm");

      rerender(<DatePickerCalendarButton size="md" />);
      button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "md");
    });

    it("refが正しく転送されること", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<DatePickerCalendarButton ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("BUTTON");
    });
  });

  describe("DatePickerYear", () => {
    it("正しくレンダリングされること", () => {
      render(<DatePickerYear />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(screen.getByText("年")).toBeInTheDocument();
    });

    it("aria-disabledがtrueの場合、readOnlyプロパティが適用されること", () => {
      render(<DatePickerYear aria-disabled="true" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("readOnlyプロパティが明示された場合、readOnlyとして扱われること", () => {
      render(<DatePickerYear readOnly />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("refが正しく転送されること", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<DatePickerYear ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("DatePickerMonth", () => {
    it("正しくレンダリングされること", () => {
      render(<DatePickerMonth />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(screen.getByText("月")).toBeInTheDocument();
    });

    it("aria-disabledがtrueの場合、readOnlyプロパティが適用されること", () => {
      render(<DatePickerMonth aria-disabled="true" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("refが正しく転送されること", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<DatePickerMonth ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("DatePickerDate", () => {
    it("正しくレンダリングされること", () => {
      render(<DatePickerDate />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(screen.getByText("日")).toBeInTheDocument();
    });

    it("aria-disabledがtrueの場合、readOnlyプロパティが適用されること", () => {
      render(<DatePickerDate aria-disabled="true" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("refが正しく転送されること", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<DatePickerDate ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });
});
