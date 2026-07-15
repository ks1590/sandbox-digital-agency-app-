import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, type Mock, vi } from "vitest";
import LoginForm from "./LoginForm";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe("LoginForm", () => {
  describe("レンダリング", () => {
    it("フォームが正しくレンダリングされること", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/ログインID/)).toBeInTheDocument();
      expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "ログイン" }),
      ).toBeInTheDocument();
    });

    it("テストユーザー用のログインボタンが表示されること", () => {
      render(<LoginForm />);

      expect(screen.getByText("テストユーザーログイン")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ユーザーAでログイン/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ユーザーBでログイン/ }),
      ).toBeInTheDocument();
    });
  });

  describe("ログインアクション", () => {
    it("通常のログインを試行するとエラーメッセージが表示されること", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const loginIdInput = screen.getByLabelText(/ログインID/);
      const passwordInput = screen.getByLabelText(/パスワード/);

      await user.type(loginIdInput, "admin");
      await user.type(passwordInput, "password");

      const submitButton = screen.getByRole("button", { name: "ログイン" });
      await user.click(submitButton);

      expect(
        screen.getByText("ログインIDまたはパスワードが間違っています。"),
      ).toBeInTheDocument();
    });

    it("ユーザーAでログインボタンを押下すると、localStorageに保存され、遷移すること", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const userAButton = screen.getByRole("button", { name: /ユーザーAでログイン/ });
      await user.click(userAButton);

      expect(localStorage.getItem("login-user-id")).toBe("test-userA");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    it("ユーザーBでログインボタンを押下すると、localStorageに保存され、遷移すること", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const userBButton = screen.getByRole("button", { name: /ユーザーBでログイン/ });
      await user.click(userBButton);

      expect(localStorage.getItem("login-user-id")).toBe("test-userB");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
