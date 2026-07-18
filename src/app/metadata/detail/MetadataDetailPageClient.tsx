"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import LinkCard from "@/components/ui/LinkCard";
import MetadataEdit from "../_components/edit/MetadataEdit";
import { useDataTypes } from "../_components/useDataTypes";
import MetadataViewTabs from "../_components/view/MetadataViewTabs";
import OverviewViewClient from "../_components/view/OverviewViewClient";
import PublishButtonClient from "../_components/view/PublishButtonClient";
import type { MetadataResponse } from "../types";

export default function MetadataDetailPageClient({
  data,
  type,
}: {
  data: MetadataResponse;
  type: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab") || "overview";
  const isEditMode = searchParams.get("mode") === "edit";
  const publishSuccess = searchParams.get("publish_success") === "true";
  const publishError = searchParams.get("publish_error") === "true";
  const { getDataTypeName } = useDataTypes(data.overview.dataTypes);

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

  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(`metadata_${type}`);
    if (saved) {
      try {
        setSessionData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [type]);

  const displayTables = sessionData?.tables || data.overview.tables;

  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

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
                href={`/metadata/detail?type=${type}&mode=edit&tab=${tabParam}`}
                className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
              >
                編集
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">データ種別</h3>
            <p className="text-base text-gray-900">{getDataTypeName(type)}</p>
          </div>

          <div className="mb-12">
            <MetadataViewTabs
              headingId="metadata-tabs-heading"
              defaultIndex={defaultIndex}
              items={[
                {
                  label: "概要",
                  id: "tab-overview",
                  content: <OverviewViewClient data={data} type={type} />,
                },
                {
                  label: "ER図",
                  id: "tab-er",
                  content: (
                    <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      ER図が表示されます
                    </div>
                  ),
                },
                {
                  label: "テーブル定義",
                  id: "tab-table-def",
                  content: (
                    <div className="flex flex-wrap gap-6 p-8">
                      {displayTables.map((table: any) => {
                        if (!table.physicalName) return null;
                        return (
                          <LinkCard
                            key={table.id || table.physicalName}
                            href={`/metadata/table-def?tab=${table.physicalName}&from=${type}`}
                            title={table.logicalName || table.physicalName}
                          />
                        );
                      })}
                      {displayTables.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500">
                          テーブル定義が紐付けられていません。
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="mt-8">
            <Link
              href="/metadata"
              className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              データベース全体に関する情報に戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
