"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ログイン処理（ダミー）
 * @param formData フォームデータ
 */
export async function login(formData: FormData) {
  const loginId = (formData.get("loginId") as string) || "Unknown User";

  // 本来はここでID/パスワードの検証を行うが、ダミー実装なので無条件でログイン成功とする
  // Cookieにダミーの認証トークンをセット
  const cookieStore = await cookies();
  cookieStore.set("auth-token", "dummy-session-12345", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: "/",
  });

  // ログインユーザーIDも保存する
  cookieStore.set("login-user-id", loginId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // ログイン後はポータルトップへリダイレクト
  redirect("/");
}

/**
 * ログアウト処理
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("login-user-id");
  redirect("/login");
}
