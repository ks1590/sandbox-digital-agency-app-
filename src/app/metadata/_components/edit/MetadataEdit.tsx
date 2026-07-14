"use client";

import { FormProvider } from "react-hook-form";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import Tab from "@/components/ui/Tab";
import type { MetadataResponse } from "../../types";
import TableDefContent from "../table-def/TableDefContent";
import DataTypeSelect from "./DataTypeSelect";
import EditFormFooter from "./EditFormFooter";
import ErDiagramTabContent from "./ErDiagramTabContent";
import OverviewTabContent from "./OverviewTabContent";
import SubtabSection from "./SubtabSection";
import { useMetadataForm } from "./useMetadataForm";

export default function MetadataEdit({
  data: apiData,
}: {
  data: MetadataResponse;
}) {
  const {
    methods,
    isInitialized,
    notification,
    isTopPage,
    subtabParam,
    pathname,
    defaultIndex,
    handleSubmit,
    handleTabChange,
    cancelHref,
    returnHref,
    returnText,
  } = useMetadataForm(apiData);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {notification && (
        <div className="w-full bg-white">
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
            <h2 className="text-2xl font-bold text-gray-900">メタデータ</h2>
          </div>

          {/*
            フォーム全体でTabを囲むことで、
            どのタブにいても更新ボタンを押した際に全てのデータが送信可能になる。
          */}
          {isInitialized ? (
            <FormProvider {...methods}>
              <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="text-gray-900"
            >
              {!isTopPage && <DataTypeSelect />}

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
                <SubtabSection subtabParam={subtabParam} pathname={pathname} />
              )}

              <EditFormFooter
                cancelHref={cancelHref}
                returnHref={returnHref}
                returnText={returnText}
              />
            </form>
            </FormProvider>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-gray-500">データを読み込み中...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
