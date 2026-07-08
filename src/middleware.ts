import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // すでにログインしている状態でログイン画面にアクセスした場合、ポータルトップへリダイレクト
  if (pathname.startsWith("/login")) {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 認証トークンがない場合、ログイン画面へリダイレクト
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcherを使用して、静的ファイル(_next/static, _next/image, favicon.icoなど)を除外したパスにミドルウェアを適用
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
