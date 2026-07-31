import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import TextPopover from "./TextPopover";

/** scrollWidth / clientWidth を指定値に固定してオーバーフロー状態を制御する */
function mockOverflow(scrollWidth: number, clientWidth: number) {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get() {
      return scrollWidth;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return clientWidth;
    },
  });
}

afterEach(() => {
  mockOverflow(0, 0);
});

describe("TextPopover", () => {
  it("オーバーフローしていない場合は span でテキストを表示する", () => {
    mockOverflow(50, 100);

    render(<TextPopover text="短いテキスト" />);

    const el = screen.getByText("短いテキスト");
    expect(el.tagName).toBe("SPAN");
    expect(
      screen.queryByRole("button", { name: "短いテキスト" }),
    ).not.toBeInTheDocument();
  });

  it("オーバーフローしている場合は button として表示する", () => {
    mockOverflow(200, 100);

    render(<TextPopover text="とても長いテキスト" />);

    expect(
      screen.getByRole("button", { name: "とても長いテキスト" }),
    ).toBeInTheDocument();
  });

  it("オーバーフロー時にホバーするとツールチップを表示する", async () => {
    mockOverflow(200, 100);
    const user = userEvent.setup();

    render(<TextPopover text="長い説明テキスト" />);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button"));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("長い説明テキスト");
  });
});
