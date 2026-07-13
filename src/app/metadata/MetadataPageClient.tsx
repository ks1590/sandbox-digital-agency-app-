"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import MetadataEdit from "./_components/edit/MetadataEdit";
import MetadataContent from "./_components/view/MetadataContent";
import type { MetadataResponse } from "./types";
import { useEffect, useState } from "react";

export default function MetadataPageClient({ data }: { data: MetadataResponse }) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";
  const isSuccess = searchParams.get("success") === "true";

  if (isEditMode) {
    return <MetadataEdit data={data} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="page-bg flex-1">
        {isSuccess && (
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type="success"
              title="ビジネスメタデータを仮登録しました"
            >
              <NotificationBannerBody>
                入力された情報が正しく保存されました。
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        )}

        <div className="page-container">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">メタデータ</h2>
            <div className="flex items-center gap-4">
              <Link
                href="/metadata?mode=edit"
                className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-[#1A30C9] focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
              >
                編集
              </Link>
              {data.overview.status === "draft" && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-green-600 px-4 py-2 text-base font-bold text-white transition-colors hover:bg-green-700 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  公開
                </button>
              )}
            </div>
          </div>

          <MetadataContent data={data} />
        </div>
      </main>
    </div>
  );
}
