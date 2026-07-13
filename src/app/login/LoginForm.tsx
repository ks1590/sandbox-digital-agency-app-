"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/form/TextInput";
import { ErrorText } from "@/components/ui/ErrorText";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const loginId = (formData.get("loginId") as string) || "";
    const password = (formData.get("password") as string) || "";

    if (!loginId || !password) {
      setError("ログインIDとパスワードを入力してください。");
      setIsPending(false);
      return;
    }

    // ダミー認証: IDが "admin" かつ パスワードが "password" の場合のみ許可
    if (loginId !== "admin" || password !== "password") {
      setError("ログインIDまたはパスワードが間違っています。");
      setIsPending(false);
      return;
    }

    // クライアントサイドでの認証情報保存
    localStorage.setItem("auth-token", "dummy-session-12345");
    localStorage.setItem("login-user-id", loginId);

    // ログイン後はポータルトップへリダイレクト
    router.replace("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-md text-sm">
        <p className="font-bold mb-1">【開発用ダミーアカウント】</p>
        <p>
          ログインID:{" "}
          <code className="bg-white px-1 py-0.5 rounded text-black">admin</code>
        </p>
        <p>
          パスワード:{" "}
          <code className="bg-white px-1 py-0.5 rounded text-black">
            password
          </code>
        </p>
      </div>

      <TextInput
        label="ログインID"
        id="loginId"
        name="loginId"
        type="text"
        required
      />
      <TextInput
        label="パスワード"
        id="password"
        name="password"
        type="password"
        required
      />

      <div className="pt-4">
        {error && (
          <ErrorText className="mb-4 font-bold text-center">
            {error}
          </ErrorText>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center min-h-[56px] rounded-[8px] border-4 border-double border-transparent bg-[#0017C1] text-white px-4 py-3 text-base font-bold underline-offset-[3px] transition-colors hover:bg-blue-900 hover:underline active:bg-blue-950 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 disabled:opacity-50"
        >
          ログイン
        </button>
      </div>
    </form>
  );
}
