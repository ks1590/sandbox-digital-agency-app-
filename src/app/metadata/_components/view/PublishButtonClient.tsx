"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
// import {
//   ModalDialog,
//   ModalDialogBody,
//   ModalDialogContent,
// } from "@/components/ui/ModalDialog";

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
      <Button
        type="button"
        variant="solid-fill"
        size="md"
        // onClick={handleOpen} sagemakerの挙動を検証の上、実装検討
        className="!bg-green-600 hover:!bg-green-700 active:!bg-green-800"
      >
        公開
      </Button>

      {/* <ModalDialog ref={dialogRef} className="m-auto">
        <ModalDialogContent>
          <ModalDialogBody className="text-center pt-8 font-bold text-lg">
            このメタデータを公開します。よろしいですか？
          </ModalDialogBody>
          <div className="flex justify-center gap-4 w-full p-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="solid-fill"
              size="md"
              onClick={handlePublish}
            >
              公開する
            </Button>
          </div>
        </ModalDialogContent>
      </ModalDialog> */}
    </>
  );
}
