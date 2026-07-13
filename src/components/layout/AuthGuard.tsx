"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    
    // すでにログインしている状態でログイン画面にアクセスした場合、ポータルトップへリダイレクト
    if (pathname?.startsWith("/login")) {
      if (token) {
        router.replace("/");
      } else {
        setIsAuthenticated(true); // render login page
      }
      return;
    }

    // 認証トークンがない場合、ログイン画面へリダイレクト
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
  }, [pathname, router]);

  // 認証チェックが終わるまでは何も表示しない（ちらつき防止）
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
