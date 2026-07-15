"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import MetadataEdit from "./_components/edit/MetadataEdit";
import MetadataContent from "./_components/view/MetadataContent";
import PublishButtonClient from "./_components/view/PublishButtonClient";
import type { MetadataResponse } from "./types";

export default function MetadataPageClient({
  data,
}: {
  data: MetadataResponse;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditMode = searchParams.get("mode") === "edit";
  const publishSuccess = searchParams.get("publish_success") === "true";
  const publishError = searchParams.get("publish_error") === "true";

  useEffect(() => {
    if (publishSuccess) {
      const timer = setTimeout(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("publish_success");
        router.replace(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [publishSuccess, searchParams, pathname, router]);

  if (isEditMode) {
    return <MetadataEdit data={data} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="page-bg flex-1">
        {publishSuccess && (
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type="success"
              title="完了通知"
            >
              <NotificationBannerBody>
                メタデータの公開処理が正常に完了しました。
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        )}

        {publishError && (
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type="error"
              title="公開に失敗しました"
            >
              <NotificationBannerBody>
                エラーが発生しました。再度お試しください。
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        )}

        <div className="page-container">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">メタデータ</h2>
            <div className="flex items-center gap-4">
              {data.overview.status === "draft" && <PublishButtonClient />}
              <Link
                href="/metadata?mode=edit"
                className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-[#1A30C9] focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
              >
                編集
              </Link>
            </div>
          </div>

          <MetadataContent data={data} />
        </div>
      </main>
    </div>
  );
}
