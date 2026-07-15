"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 各ユーザーがアクセス可能なパスのプレフィックス
const allowedPaths: Record<string, string[]> = {
  "test-userA": ["/extraction-status"],
  "test-userB": ["/metadata", "/data-profile"],
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("login-user-id");

    if (pathname.startsWith("/login")) {
      if (token) {
        // すでにログインしている状態でログイン画面にアクセスした場合、ポータルトップへリダイレクト
        router.replace("/");
      } else {
        setIsAuthenticated(true);
      }
    } else {
      if (!token) {
        // 認証トークンがない場合、ログイン画面へリダイレクト
        router.replace("/login");
      } else {
        // ポータルトップ(/)は全員アクセス可能
        if (pathname !== "/") {
          // 権限チェック
          const userAllowedPaths =
            userId && allowedPaths[userId] ? allowedPaths[userId] : [];

          // 現在のパスが許可されたパスのいずれかで始まっているか確認
          const isAllowed = userAllowedPaths.some((allowedPath) =>
            pathname.startsWith(allowedPath),
          );

          if (!isAllowed) {
            // 権限がないパスへのアクセスはポータルトップへリダイレクト
            router.replace("/");
            return;
          }
        }

        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  // 認証状態が確定するまでは何も表示しない（チラつき防止）
  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}
