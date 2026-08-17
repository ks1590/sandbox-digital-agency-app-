"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="bg-white p-8 rounded-12 border border-solid-gray-200 shadow-sm max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-error-1">
          ページが見つかりません
        </h1>
        <p className="text-solid-gray-600 mb-8 leading-relaxed">
          お探しのページは削除されたか、URLが変更された可能性があります。
          <br />
          正しいURLを入力するか、トップページに戻ってください。
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="md" onClick={() => router.back()}>
            前の画面に戻る
          </Button>
          <Button variant="solid-fill" size="md" asChild>
            <Link href="/">トップページへ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
