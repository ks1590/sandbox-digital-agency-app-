"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LinkCard from "@/components/ui/LinkCard";
import Tab from "@/components/ui/Tab";
import type { MetadataResponse } from "../../types";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), {
  ssr: false,
});

import type { MetadataFormData } from "../schema";

/**
 * メタデータトップページ用のクライアントコンポーネント
 * サーバーから受け取ったデータを初期表示し、モック環境用としてsessionStorageがあれば上書きする
 */
export default function MetadataContent({ data }: { data: MetadataResponse }) {
  const [sessionData, setSessionData] = useState<MetadataFormData | null>(null);

  // 今回はモックAPI環境のため、サーバー側にはデータが永続化されない。
  // そのため、画面リロード時や遷移時に更新内容を反映できるよう sessionData を優先する。
  useEffect(() => {
    const saved = sessionStorage.getItem("metadata_top");
    if (saved) {
      try {
        setSessionData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const overviewText = sessionData?.overviewText ?? data.overview.overviewText;
  const dataTypes = sessionData?.dataTypes ?? data.overview.dataTypes;
  const keyInfoText = sessionData?.keyInfoText ?? data.overview.keyInfoText;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const defaultIndex = tabParam === "data-type" ? 1 : 0;

  const handleTabChange = (index: number) => {
    const tabMap = ["overview", "data-type"];
    const newTab = tabMap[index] || "overview";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-10">
      <Tab
        headingId="view-tabs-top-heading"
        defaultIndex={defaultIndex}
        onChange={handleTabChange}
        items={[
          {
            label: "概要",
            id: "tab-view-top-overview",
            content: (
              <div className="pt-6">
                {overviewText ? (
                  <MarkdownEditor
                    key={`overview-${overviewText}`}
                    markdown={overviewText}
                    readOnly={true}
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    データがありません
                  </p>
                )}
              </div>
            ),
          },
          {
            label: "データ種別",
            id: "tab-view-top-datatype",
            content: (
              <div className="pt-6">
                <div className="flex flex-wrap gap-6 py-4">
                  {dataTypes.map((dt) => (
                    <LinkCard
                      key={dt.id}
                      href={`/metadata/detail?type=${encodeURIComponent(dt.name)}`}
                      title={dt.name}
                    />
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
