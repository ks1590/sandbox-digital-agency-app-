"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import Header from "@/components/layout/Header";
import { TableDefGrid } from "../_components/table-def/TableDefContent";
import { SortableTableWithColumns } from "../_components/table-def/TableDefViewClient";
import MetadataViewTabs from "../_components/view/MetadataViewTabs";
import PublishButtonClient from "../_components/view/PublishButtonClient";
import type { MetadataResponse } from "../types";

export default function MetadataTableDefPageClient({ data }: { data: MetadataResponse }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "disease";
  const isEditMode = searchParams.get("mode") === "edit";
  const fromType = searchParams.get("from") || "clinical";
  const publishSuccess = searchParams.get("publish_success") === "true";
  const publishError = searchParams.get("publish_error") === "true";

  let defaultIndex = 0;
  if (tabParam === "allergy") defaultIndex = 1;
  else if (tabParam === "examination") defaultIndex = 2;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="page-bg flex-1">
        {publishSuccess && (
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type="success"
              title="公開しました"
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
                <Link
                  href={`/metadata/${fromType}?mode=edit&tab=table-def&subtab=${tabParam}`}
                  className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-[#1A30C9] focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  編集
                </Link>
                {data.overview.status === "draft" && <PublishButtonClient />}
              </div>
            )}
          </div>

          {!isEditMode && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                データ種別
              </h3>
              <p className="text-base text-gray-900">
                {fromType === "clinical"
                  ? "臨床情報"
                  : fromType === "document"
                    ? "ドキュメント"
                    : fromType}
              </p>
            </div>
          )}

          <div className="mb-12">
            <MetadataViewTabs
              headingId="table-def-tabs-heading"
              defaultIndex={defaultIndex}
              tabMap={["disease", "allergy", "examination"]}
              items={[
                {
                  label: "傷病",
                  id: "tab-disease",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid subtab="disease" />
                      ) : (
                        <SortableTableWithColumns
                          subtab="disease"
                          data={data}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: "薬剤・その他アレルギー等",
                  id: "tab-allergy",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid subtab="allergy" />
                      ) : (
                        <SortableTableWithColumns
                          subtab="allergy"
                          data={data}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: "感染症・検査",
                  id: "tab-examination",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid subtab="examination" />
                      ) : (
                        <SortableTableWithColumns
                          subtab="examination"
                          data={data}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {isEditMode ? (
            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Link
                href={`/metadata/${fromType}?mode=edit&tab=table-def`}
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 w-full sm:w-auto"
              >
                キャンセル
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-[#0017C1] px-4 py-3 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  仮登録
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                href={`/metadata/${fromType}?tab=table-def`}
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-3 text-base font-bold text-[#0017C1] transition-colors hover:bg-gray-50 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
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
