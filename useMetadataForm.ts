"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveMetadataAction } from "../../actions";
import type { MetadataResponse } from "../../types";
import { type MetadataFormData, metadataSchema } from "../schema";

export type NotificationState = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

export function useMetadataForm(apiData: MetadataResponse) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isTopPage = pathname === "/metadata";
  const tabParam = searchParams.get("tab") || "overview";
  const subtabParam = searchParams.get("subtab");

  const methods = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      dataType: "clinical",
      overviewText: "",
      dataTypes: [],
      startYear: "",
      latestYear: "",
      updateFrequencies: [],
      tables: [],
      notesText: "",
      keyInfoText: "",
      tableDefs: {},
    },
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const typeParam =
    searchParams.get("type") ||
    (pathname !== "/metadata" && pathname !== "/metadata/detail"
      ? pathname.split("/").pop()
      : "clinical");

  useEffect(() => {
    if (!apiData || isInitialized) return;

    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        methods.reset(parsed);
        setIsInitialized(true);
        return;
      } catch (e) {
        console.error("Failed to parse sessionStorage data", e);
      }
    }

    const CHILD_OVERVIEW_TEMPLATE = `
## データ説明情報
- 
## 収集期間
| 項目 | 内容 |
| --- | --- |
| 収集開始年度 | |
| 最新の提供可能年度 | |
| 収集頻度 | |

## 更新頻度
- 
## テーブル一覧
テーブル物理名 | テーブル論理名 | 概要 | 格納単位 |
| ---| --- | --- | --- |
| | | | |
| | | | |
| | | | |

## 留意事項
-
`;

    const TOP_OVERVIEW_TEMPLATE = `
## データ説明情報
- 
## キー情報
- 
`;

    const OVERVIEW_TEMPLATE = isTopPage
      ? TOP_OVERVIEW_TEMPLATE
      : CHILD_OVERVIEW_TEMPLATE;

    methods.reset({
      dataType: typeParam || "clinical",
      overviewText: OVERVIEW_TEMPLATE,
      dataTypes: apiData.overview.dataTypes,
      startYear: apiData.overview.startYear,
      latestYear: apiData.overview.latestYear,
      updateFrequencies: apiData.overview.updateFrequencies,
      tables: apiData.overview.tables,
      notesText: apiData.overview.notesText,
      keyInfoText: apiData.overview.keyInfoText,
      tableDefs: apiData.tableDefs,
    });
    setIsInitialized(true);
  }, [apiData, methods, isTopPage, isInitialized, typeParam]);

  useEffect(() => {
    if (!isInitialized) return;
    const subscription = methods.watch(() => {
      const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
      sessionStorage.setItem(storageKey, JSON.stringify(methods.getValues()));
    });
    return () => subscription.unsubscribe();
  }, [methods, isInitialized, isTopPage, typeParam]);

  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

  const [notification] = useState<NotificationState>(null);

  const handleSubmit = async (data: MetadataFormData) => {
    await saveMetadataAction(data);

    // 今回はバックエンド（DB）が存在しないモック環境のため、
    // 画面リロード時に編集内容が消えないようにセッションストレージにも保存しておく
    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    sessionStorage.setItem(storageKey, JSON.stringify(data));

    if (isTopPage) {
      router.push("/metadata");
    } else if (subtabParam) {
      router.push(
        `/metadata/table-def?tab=${subtabParam}&from=${typeParam || "clinical"}`,
      );
    } else {
      const viewParams = new URLSearchParams();
      viewParams.set("tab", tabParam);
      if (typeParam) {
        viewParams.set("type", typeParam);
      }
      router.push(`${pathname}?${viewParams.toString()}`);
    }
  };

  const handleTabChange = (index: number) => {
    const tabMap = ["overview", "er", "table-def"];
    const newTab = tabMap[index] || "overview";

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("subtab");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const cancelHref = isTopPage
    ? "/metadata"
    : subtabParam
      ? `/metadata/table-def?tab=${subtabParam}&from=${searchParams.get("from") || "clinical"}`
      : `${pathname}?tab=${tabParam}`;

  const handleCancel = () => {
    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    sessionStorage.removeItem(storageKey);
    router.push(cancelHref);
  };

  const fromType = searchParams.get("from") || "clinical";
  const returnHref = isTopPage
    ? null
    : subtabParam
      ? `/metadata/detail?type=${fromType}&mode=edit&tab=table-def`
      : `/metadata?mode=edit`;

  const returnText = isTopPage
    ? null
    : subtabParam
      ? "データ種別に関する情報に戻る"
      : "データベース全体に関する情報に戻る";

  return {
    methods,
    isInitialized,
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
  };
}
