"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { TextInput } from "@/components/form/TextInput";
import { ErrorText } from "@/components/ui/ErrorText";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-md text-sm">
        <p className="font-bold mb-1">【開発用ダミーアカウント】</p>
        <p>ログインID: <code className="bg-white px-1 py-0.5 rounded text-black">admin</code></p>
        <p>パスワード: <code className="bg-white px-1 py-0.5 rounded text-black">password</code></p>
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
        {state?.error && (
          <ErrorText className="mb-4 font-bold text-center">
            {state.error}
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
