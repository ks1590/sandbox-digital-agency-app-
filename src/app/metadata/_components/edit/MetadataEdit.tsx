"use client";

import { FormProvider, useFormContext } from "react-hook-form";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import Tab from "@/components/ui/Tab";
import type { MetadataResponse } from "../../types";
import type { MetadataFormData } from "../schema";
import TableDefContent from "../table-def/TableDefContent";
import DataTypeListEditor from "./DataTypeListEditor";
import DataTypeSelect from "./DataTypeSelect";
import EditFormFooter from "./EditFormFooter";
import ErDiagramTabContent from "./ErDiagramTabContent";
import OverviewTabContent from "./OverviewTabContent";
import SubtabSection from "./SubtabSection";
import { useMetadataForm } from "./useMetadataForm";

function DataTypeSection() {
  const { watch, setValue } = useFormContext<MetadataFormData>();
  const dataTypes = watch("dataTypes") || [];
  return (
    <DataTypeListEditor
      dataTypes={dataTypes}
      onChange={(val) => setValue("dataTypes", val, { shouldDirty: true })}
    />
  );
}

export default function MetadataEdit({
  data: apiData,
}: {
  data: MetadataResponse;
}) {
  const {
    methods,
    isInitialized,
    isDirty,
    notification,
    isTopPage,
    subtabParam,
    pathname,
    defaultIndex,
    handleSubmit,
    handleTabChange,
    handleCancel,
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

          {isInitialized ? (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(handleSubmit)}
                className="text-gray-900"
              >
                {!isTopPage && <DataTypeSelect readonly />}

                {isTopPage ? (
                  <div className="mb-12">
                    <Tab
                      headingId="register-tabs-top-heading"
                      defaultIndex={defaultIndex}
                      onChange={handleTabChange}
                      disabled={true}
                      disabledReason={
                        "編集中は切り替えできません。\n変更を仮登録またはキャンセルしてください。"
                      }
                      items={[
                        {
                          label: "概要",
                          id: "tab-top-overview",
                          content: <OverviewTabContent isTopPage />,
                        },
                        {
                          label: "データ種別",
                          id: "tab-top-datatype",
                          content: (
                            <div className="pt-6">
                              <DataTypeSection />
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="mb-12" hidden={!!subtabParam}>
                    <Tab
                      headingId="register-tabs-heading"
                      defaultIndex={defaultIndex}
                      onChange={handleTabChange}
                      disabled={true}
                      disabledReason={
                        "編集中は切り替えできません。\n変更を仮登録またはキャンセルしてください。"
                      }
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
                  <SubtabSection
                    subtabParam={subtabParam}
                    pathname={pathname}
                  />
                )}

                <EditFormFooter
                  onCancel={handleCancel}
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
