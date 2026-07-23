"use client";

import Link from "next/link";

interface EditFormFooterProps {
  onCancel: () => void;
  returnHref?: string | null;
  returnText?: string | null;
}
export default function EditFormFooter({
  onCancel,
  returnHref,
  returnText,
}: EditFormFooterProps) {
  return (
    <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6">
      <div className="w-full sm:w-auto">
        {returnHref && returnText ? (
          <Link
            href={returnHref}
            className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
          >
            {returnText}
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
        >
          仮登録
        </button>
      </div>
    </div>
  );
}
