"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Header from "../../../components/layout/Header";
import Tab from "../../../components/ui/Tab";
import { NotificationBanner } from "../../../components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "../../../components/layout/NotificationBanner/parts/Body";
import TableDefContent, { TableDefGrid } from "./TableDefContent";
import OverviewTabContent from "./OverviewTabContent";
import ErDiagramTabContent from "./ErDiagramTabContent";

/** クライアントサイドでのCookie取得（簡易実装） */
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return undefined;
}

export default function MetadataEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isTopPage = pathname === "/metadata";
  const tabParam = searchParams.get("tab") || "overview";
  const subtabParam = searchParams.get("subtab");

  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

  const [userId, setUserId] = useState<string | undefined>();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    setUserId(getCookie("login-user-id"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // pathnameから mode パラメータを除外して参照画面に戻る
    const viewParams = new URLSearchParams();
    viewParams.set("tab", tabParam);
    viewParams.set("success", "true");
    router.push(`${pathname}?${viewParams.toString()}`);
  };

  const handleErrorSubmit = () => {
    setNotification({
      type: "error",
      title: "操作を完了できませんでした",
      message: "入力内容に誤りがあります。エラーメッセージを確認してください。",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (index: number) => {
    const tabMap = ["overview", "er", "table-def"];
    const newTab = tabMap[index] || "overview";

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("subtab"); // clean up any subtab param just in case

    // Replace URL to preserve tab state without pushing to history stack
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      {notification && (
        <div className="w-full bg-white border-b border-gray-200">
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type={notification.type}
              headingLevel="h3"
              title={notification.title}
            >
              <NotificationBannerBody>
                {notification.message}
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        </div>
      )}

      <main className="page-bg flex-1">
        <div className="page-container pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              メタデータ
            </h2>
          </div>

          {/*
              フォーム全体でTabを囲むことで、
              どのタブにいても更新ボタンを押した際に全てのデータが送信可能になる。
            */}
          <form onSubmit={handleSubmit} className="text-gray-900">
            {isTopPage ? (
              <div className="mb-12">
                <OverviewTabContent isTopPage />
              </div>
            ) : (
              <div className="mb-12" hidden={!!subtabParam}>
                <Tab
                  headingId="register-tabs-heading"
                  defaultIndex={defaultIndex}
                  onChange={handleTabChange}
                  items={[
                    {
                      label: "概要",
                      id: "tab-overview",
                      content: <OverviewTabContent isTopPage={false} />,
                    },
                    {
                      label: "ER図",
                      id: "tab-er",
                      content: <ErDiagramTabContent />,
                    },
                    {
                      label: "テーブル定義",
                      id: "tab-table-def",
                      content: <TableDefContent />,
                    },
                  ]}
                />
              </div>
            )}

            {!!subtabParam && (
              <div className="mb-12">
                <Tab
                  headingId="subtab-tabs-heading"
                  defaultIndex={
                    subtabParam === "allergy"
                      ? 1
                      : subtabParam === "examination"
                        ? 2
                        : 0
                  }
                  onChange={(index) => {
                    const newSubtab =
                      index === 0
                        ? "disease"
                        : index === 1
                          ? "allergy"
                          : "examination";
                    router.push(
                      `${pathname}?mode=edit&tab=table-def&subtab=${newSubtab}`
                    );
                  }}
                  items={[
                    {
                      label: "傷病",
                      id: "subtab-disease",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                    {
                      label: "アレルギー",
                      id: "subtab-allergy",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                    {
                      label: "検査",
                      id: "subtab-examination",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}

            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Link
                href={
                  isTopPage
                    ? "/metadata"
                    : subtabParam
                      ? `/metadata/table-def?tab=${subtabParam}&from=${pathname.split("/").pop()}`
                      : `${pathname}?tab=${tabParam}`
                }
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300 w-full sm:w-auto"
              >
                キャンセル
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleErrorSubmit}
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-white border border-gray-400 px-4 py-3 text-base font-bold text-error-1 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
                >
                  エラーテスト
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-[#0017C1] px-4 py-3 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
                >
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
