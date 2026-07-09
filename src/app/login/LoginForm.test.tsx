import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, type Mock, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("@/actions/auth", () => ({
  login: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

import { useActionState } from "react";

const mockUseActionState = useActionState as Mock;

function setupMockActionState(
  state: { error: string } | null = null,
  isPending = false,
) {
  const mockFormAction = vi.fn();
  mockUseActionState.mockReturnValue([state, mockFormAction, isPending]);
  return mockFormAction;
}

describe("LoginForm", () => {
  describe("正常系", () => {
    it("フォームが正しくレンダリングされること", () => {
      setupMockActionState();
      render(<LoginForm />);

      expect(screen.getByLabelText(/ログインID/)).toBeInTheDocument();
      expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "ログイン" }),
      ).toBeInTheDocument();
    });

    it("開発用ダミーアカウント情報が表示されること", () => {
      setupMockActionState();
      render(<LoginForm />);

      expect(
        screen.getByText("【開発用ダミーアカウント】"),
      ).toBeInTheDocument();
      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText("password")).toBeInTheDocument();
    });

    it("各入力欄に値を入力できること", async () => {
      setupMockActionState();
      const user = userEvent.setup();
      render(<LoginForm />);

      const loginIdInput = screen.getByLabelText(/ログインID/);
      const passwordInput = screen.getByLabelText(/パスワード/);

      await user.type(loginIdInput, "admin");
      expect(loginIdInput).toHaveValue("admin");

      await user.type(passwordInput, "password");
      expect(passwordInput).toHaveValue("password");
    });

    it("フォーム送信時に formAction が呼び出されること", async () => {
      const mockFormAction = setupMockActionState();
      render(<LoginForm />);

      const form = screen
        .getByRole("button", { name: "ログイン" })
        .closest("form");
      expect(form).toBeInTheDocument();
      expect(mockFormAction).toBeDefined();
    });
  });

  describe("異常系", () => {
    it("Server Action がエラーを返した場合、エラーメッセージが表示されること", () => {
      const errorMessage = "ログインIDまたはパスワードが間違っています。";
      setupMockActionState({ error: errorMessage });
      render(<LoginForm />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("送信中（isPending）にログインボタンが無効化されること", () => {
      setupMockActionState(null, true);
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", { name: "ログイン" });
      expect(submitButton).toBeDisabled();
    });
  });
});
