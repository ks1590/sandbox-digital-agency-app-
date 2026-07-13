/**
 * クライアントサイド用のログイン処理（ダミー）
 */
export async function login(loginId: string, password: string): Promise<{ error?: string }> {
  if (!loginId || !password) {
    return { error: "ログインIDとパスワードを入力してください。" };
  }

  // ダミー認証: IDが "admin" かつ パスワードが "password" の場合のみ許可
  if (loginId !== "admin" || password !== "password") {
    return { error: "ログインIDまたはパスワードが間違っています。" };
  }

  // localStorageにダミーの認証トークンとユーザーIDを保存
  localStorage.setItem("auth-token", "dummy-session-12345");
  localStorage.setItem("login-user-id", loginId);

  // ログイン後はポータルトップへリダイレクト
  window.location.href = "/";
  
  return {};
}

/**
 * ログアウト処理
 */
export async function logout() {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("login-user-id");
  window.location.href = "/login";
}
