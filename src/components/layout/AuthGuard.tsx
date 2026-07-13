"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
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
