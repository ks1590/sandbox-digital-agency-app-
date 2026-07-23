"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import { TableDefGrid } from "../_components/table-def/TableDefContent";
import { SortableTableWithColumns } from "../_components/table-def/TableDefViewClient";
import MetadataViewTabs from "../_components/view/MetadataViewTabs";
import PublishButtonClient from "../_components/view/PublishButtonClient";
import { useDataTypes } from "../_components/useDataTypes";
import type { MetadataResponse } from "../types";

export default function MetadataTableDefPageClient({
  data,
}: {
  data: MetadataResponse;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditMode = searchParams.get("mode") === "edit";
  const fromType = searchParams.get("from") || "clinical";
  const publishSuccess = searchParams.get("publish_success") === "true";
  const publishError = searchParams.get("publish_error") === "true";

  useEffect(() => {
    if (publishSuccess) {
      const timer = setTimeout(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("publish_success");
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [publishSuccess, searchParams, pathname, router]);

  const validTables = data.overview.tables.filter((t) => t.physicalName);
  const fallbackTab = validTables.length > 0 ? validTables[0].physicalName : "disease";
  const tabParam = searchParams.get("tab") || fallbackTab;

  const activeIndex = validTables.findIndex((t) => t.physicalName === tabParam);
  const defaultIndex = activeIndex !== -1 ? activeIndex : 0;
  const { getDataTypeName } = useDataTypes(data.overview.dataTypes);

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
            {!isEditMode && (
              <div className="flex items-center gap-4">
                {data.overview.status === "draft" && <PublishButtonClient />}
                <Link
                  href={`/metadata/detail?type=${fromType}&mode=edit&tab=table-def&subtab=${tabParam}`}
                  className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  編集
                </Link>
              </div>
            )}
          </div>

          {!isEditMode && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                データ種別
              </h3>
              <p className="text-base text-gray-900">
                {getDataTypeName(fromType)}
              </p>
            </div>
          )}

          <div className="mb-12">
            <MetadataViewTabs
              headingId="table-def-tabs-heading"
              defaultIndex={defaultIndex}
              tabMap={validTables.map((t) => t.physicalName)}
              items={validTables.map((table) => ({
                label: table.logicalName || table.physicalName,
                id: `tab-${table.physicalName}`,
                content: (
                  <div className="py-6">
                    {isEditMode ? (
                      <TableDefGrid subtab={table.physicalName} />
                    ) : (
                      <SortableTableWithColumns
                        subtab={table.physicalName}
                        data={data}
                      />
                    )}
                  </div>
                ),
              }))}
            />
          </div>

          {isEditMode ? (
            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Link
                href={`/metadata/detail?type=${fromType}&mode=edit&tab=table-def`}
                className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-gray-400 bg-white px-4 py-2 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
              >
                キャンセル
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  仮登録
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                href={`/metadata/detail?type=${fromType}&tab=table-def`}
                className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
              >
                データ種別に関する情報に戻る
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
