"use client";

import Link from "next/link";

interface EditFormFooterProps {
  /** キャンセルボタンの遷移先 */
  cancelHref: string;
  /** エラーテストボタンのクリックハンドラ */
  onErrorTest: () => void;
}

/**
 * 編集フォームのフッター（キャンセル・エラーテスト・更新ボタン）
 */
export default function EditFormFooter({
  cancelHref,
  onErrorTest,
}: EditFormFooterProps) {
  return (
    <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
      <Link
        href={cancelHref}
        className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
      >
        キャンセル
      </Link>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onErrorTest}
          className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-white border border-gray-400 px-4 py-3 text-base font-bold text-error-1 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
        >
          エラーテスト
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-[#0017C1] px-4 py-3 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
        >
          更新
        </button>
      </div>
    </div>
  );
}
