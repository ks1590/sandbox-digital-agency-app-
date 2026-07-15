"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    setError("ログインIDまたはパスワードが間違っています。");
    setIsPending(false);
  };

  const handleTestUserLogin = (userId: string) => {
    localStorage.setItem("auth-token", "dummy-session-12345");
    localStorage.setItem("login-user-id", userId);
    router.replace("/");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput label="ログインID" id="loginId" name="loginId" type="text" />
        <TextInput
          label="パスワード"
          id="password"
          name="password"
          type="password"
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

      <div className="pt-6 border-t border-gray-200 space-y-4">
        <p className="font-bold text-center">テストユーザーログイン</p>
        <button
          type="button"
          onClick={() => handleTestUserLogin("test-userA")}
          className="inline-flex w-full items-center justify-center min-h-[56px] rounded-[8px] border border-gray-400 bg-white text-gray-900 px-4 py-3 text-base font-bold transition-colors hover:bg-gray-50 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2"
        >
          業務運営事業者
        </button>
        <button
          type="button"
          onClick={() => handleTestUserLogin("test-userB")}
          className="inline-flex w-full items-center justify-center min-h-[56px] rounded-[8px] border border-gray-400 bg-white text-gray-900 px-4 py-3 text-base font-bold transition-colors hover:bg-gray-50 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2"
        >
          診療情報DB管理担当課
        </button>
      </div>
    </div>
  );
}
