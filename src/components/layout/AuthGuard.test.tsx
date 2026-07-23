import { render, screen, waitFor } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import AuthGuard from "./AuthGuard";

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe("AuthGuard", () => {
  const mockReplace = vi.fn();
  const mockUseRouter = useRouter as Mock;
  const mockUsePathname = usePathname as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <AuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AuthGuard>,
    );
  };

  it("未ログイン時、ログイン画面以外へのアクセスは /login にリダイレクトされること", async () => {
    mockUsePathname.mockReturnValue("/dashboard");
    renderComponent();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("未ログイン時、ログイン画面へのアクセスは許可されること", async () => {
    mockUsePathname.mockReturnValue("/login");
    renderComponent();

    expect(await screen.findByTestId("protected-content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("ログイン済み時、ログイン画面へのアクセスは / にリダイレクトされること", async () => {
    localStorage.setItem("auth-token", "dummy-token");
    mockUsePathname.mockReturnValue("/login");
    renderComponent();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("ログイン済み時、 / (ポータルトップ) へのアクセスは許可されること", async () => {
    localStorage.setItem("auth-token", "dummy-token");
    mockUsePathname.mockReturnValue("/");
    renderComponent();

    expect(await screen.findByTestId("protected-content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("test-userA は /extraction-status へのアクセスが許可されること", async () => {
    localStorage.setItem("auth-token", "dummy-token");
    localStorage.setItem("login-user-id", "test-userA");
    mockUsePathname.mockReturnValue("/extraction-status");
    renderComponent();

    expect(await screen.findByTestId("protected-content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("test-userA は権限のないパスへのアクセス時、 / にリダイレクトされること", async () => {
    localStorage.setItem("auth-token", "dummy-token");
    localStorage.setItem("login-user-id", "test-userA");
    mockUsePathname.mockReturnValue("/metadata");
    renderComponent();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("test-userB は /metadata へのアクセスが許可されること", async () => {
    localStorage.setItem("auth-token", "dummy-token");
    localStorage.setItem("login-user-id", "test-userB");
    mockUsePathname.mockReturnValue("/metadata");
    renderComponent();

    expect(await screen.findByTestId("protected-content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
