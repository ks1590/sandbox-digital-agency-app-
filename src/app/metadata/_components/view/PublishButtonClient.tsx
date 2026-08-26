"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ModalDialog,
  ModalDialogActions,
  ModalDialogBody,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
} from "@/components/ui/ModalDialog";
import {
  getMetadataChanges,
  type MetadataChangeItem,
} from "./getMetadataChanges";

// sessionStorage からメタデータ編集用のキーをすべて削除する関数
const clearMetadataStorage = () => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith("metadata_")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => {
    sessionStorage.removeItem(k);
  });
};

export default function PublishButtonClient() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [changeItems, setChangeItems] = useState<MetadataChangeItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPublishSuccess = searchParams.get("publish_success") === "true";

  useEffect(() => {
    setIsMounted(true);
    if (isPublishSuccess) {
      clearMetadataStorage();
      setChangeItems([]);
    } else {
      const changes = getMetadataChanges();
      setChangeItems(changes);
    }
  }, [isPublishSuccess]);

  const handleOpen = () => {
    const changes = getMetadataChanges();
    setChangeItems(changes);
    if (changes.length > 0) {
      dialogRef.current?.showModal();
    }
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
      clearMetadataStorage();
      setChangeItems([]);
      params.set("publish_success", "true");
      params.delete("publish_error");
    } else {
      params.set("publish_error", "true");
      params.delete("publish_success");
    }
    router.push(`${pathname}?${params.toString()}`);
    handleClose();
  };

  // 変更項目をデータ種別（category）ごとにグループ化
  const groupedChanges = useMemo(() => {
    return changeItems.reduce<
      { category: string; items: MetadataChangeItem[] }[]
    >((acc, item) => {
      const category = item.category || "その他";
      let group = acc.find((g) => g.category === category);
      if (!group) {
        group = { category, items: [] };
        acc.push(group);
      }
      group.items.push(item);
      return acc;
    }, []);
  }, [changeItems]);

  // マウント前または変更がない場合は公開ボタンを表示しない
  if (!isMounted || changeItems.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="solid-fill"
        size="md"
        onClick={handleOpen} // sagemakerの挙動を検証の上、実装検討
        className="!bg-green-600 hover:!bg-green-700 active:!bg-green-800"
      >
        公開
      </Button>

      <ModalDialog
        ref={dialogRef}
        className="m-auto !w-[90vw] !max-w-2xl"
        closeOnBackdropClick={false}
      >
        <ModalDialogContent className="!max-w-none w-full">
          <ModalDialogHeader>
            <ModalDialogHeading className="text-center text-lg font-bold">
              このメタデータを公開します。 よろしいですか？
            </ModalDialogHeading>
          </ModalDialogHeader>

          <ModalDialogBody className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                変更内容の確認
              </p>

              <div
                className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 divide-y divide-gray-200"
                data-testid="publish-change-list"
              >
                {groupedChanges.map((group) => (
                  <div key={group.category} className="p-3 space-y-1.5">
                    <div className="font-bold text-sm text-gray-900">
                      {group.category}
                    </div>
                    <ul className="pl-4 space-y-1 text-sm text-gray-800 list-disc list-outside">
                      {group.items.map((item) => (
                        <li
                          key={`${item.category}-${item.field}-${item.text || item.detail || ""}`}
                          className="leading-relaxed"
                        >
                          {item.text || item.detail || item.field}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </ModalDialogBody>

          <ModalDialogActions className="justify-center gap-4">
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
          </ModalDialogActions>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
}
