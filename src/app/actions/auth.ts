"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ログイン処理（ダミー）
 * @param formData フォームデータ
 */
export async function login(formData: FormData) {
  // 本来はここでID/パスワードの検証を行うが、ダミー実装なので無条件でログイン成功とする
  // Cookieにダミーの認証トークンをセット
  (await cookies()).set("auth-token", "dummy-session-12345", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: "/",
  });

  // ログイン後はポータルトップへリダイレクト
  redirect("/");
}

/**
 * ログアウト処理
 */
export async function logout() {
  (await cookies()).delete("auth-token");
  redirect("/login");
}
