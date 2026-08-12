"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import { Button } from "@/components/ui/Button";
import { TableDefGrid } from "../_components/table-def/TableDefContent";
import { TableDefTable } from "../_components/table-def/TableDefViewClient";
import { useDataTypes } from "../_components/useDataTypes";
import MetadataViewTabs from "../_components/view/MetadataViewTabs";
import PublishButtonClient from "../_components/view/PublishButtonClient";
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
  const fromType = searchParams.get("from") || "臨床情報";
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [publishSuccess, searchParams, pathname, router]);

  const validTables = data.overview.tables.filter((t) => t.physicalName);
  const fallbackTab =
    validTables.length > 0 ? validTables[0].physicalName : "disease";
  const tabParam = searchParams.get("tab") || fallbackTab;

  const activeIndex = validTables.findIndex((t) => t.physicalName === tabParam);
  const defaultIndex = activeIndex !== -1 ? activeIndex : 0;
  const { getDataTypeName } = useDataTypes(data.overview.datatypeDataProductNames);

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
                <Button asChild variant="solid-fill" size="md">
                  <Link
                    href={`/metadata/detail?type=${fromType}&mode=edit&tab=table-def&subtab=${tabParam}`}
                  >
                    編集
                  </Link>
                </Button>
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
                      <TableDefTable
                        subtab={table.physicalName}
                        data={data}
                        fromType={fromType}
                      />
                    )}
                  </div>
                ),
              }))}
            />
          </div>

          {isEditMode ? (
            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Button
                asChild
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <Link
                  href={`/metadata/detail?type=${fromType}&mode=edit&tab=table-def`}
                >
                  キャンセル
                </Link>
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="button" variant="solid-fill" size="md">
                  仮登録
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href={`/metadata/detail?type=${fromType}&tab=table-def`}>
                  データ種別に関する情報に戻る
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
