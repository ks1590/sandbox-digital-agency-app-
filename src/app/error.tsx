"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="bg-white p-8 rounded-12 border border-solid-gray-200 shadow-sm max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-error-1">
          システムエラーが発生しました
        </h1>
        <p className="text-solid-gray-600 mb-8 leading-relaxed">
          申し訳ありませんが、システムで予期せぬエラーが発生しました。
          <br />
          通信環境をご確認の上、しばらく時間をおいてから再度お試しください。
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="md" onClick={() => router.back()}>
            前の画面に戻る
          </Button>
          <Button variant="solid-fill" size="md" onClick={() => reset()}>
            再試行
          </Button>
        </div>
      </div>
    </div>
  );
}
