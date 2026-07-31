"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextInput } from "@/components/form/TextInput";
import { Button } from "@/components/ui/Button";
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
          <Button
            type="submit"
            variant="solid-fill"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            ログイン
          </Button>
        </div>
      </form>

      <div className="pt-6 border-t border-gray-200 space-y-4">
        <p className="font-bold text-center">テストユーザーログイン</p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleTestUserLogin("test-userA")}
          className="w-full"
        >
          業務運営事業者
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleTestUserLogin("test-userB")}
          className="w-full"
        >
          診療情報DB管理担当課
        </Button>
      </div>
    </div>
  );
}
