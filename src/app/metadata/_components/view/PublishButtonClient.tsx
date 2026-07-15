"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import {
  ModalDialog,
  ModalDialogBody,
  ModalDialogContent,
} from "@/components/ui/ModalDialog";

export default function PublishButtonClient() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOpen = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handlePublish = async () => {
    // API呼び出しは別途実装予定
    // ここではテスト用にランダムで成功・失敗を分岐させます
    const isSuccess = Math.random() > 0.5;
    const params = new URLSearchParams(searchParams.toString());

    if (isSuccess) {
      params.set("publish_success", "true");
      params.delete("publish_error");
    } else {
      params.set("publish_error", "true");
      params.delete("publish_success");
    }
    router.push(`${pathname}?${params.toString()}`);
    handleClose();
  };

  return (
    <>
      <button
        type="button"
        // onClick={handleOpen} sagemakerの挙動を検証の上、実装検討
        className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-green-600 px-4 py-2 text-base font-bold text-white transition-colors hover:bg-green-700 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
      >
        公開
      </button>

      {/* <ModalDialog ref={dialogRef} className="m-auto">
        <ModalDialogContent>
          <ModalDialogBody className="text-center pt-8 font-bold text-lg">
            このメタデータを公開します。よろしいですか？
          </ModalDialogBody>
          <div className="flex justify-center gap-4 w-full p-6">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-solid border-gray-600 bg-white px-4 py-2 text-base font-bold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-[#1A30C9] focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              公開する
            </button>
          </div>
        </ModalDialogContent>
      </ModalDialog> */}
    </>
  );
}
