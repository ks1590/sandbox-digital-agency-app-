"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EXAMINATION_MOCK_DATA, saveMetadata } from "../../api";
import {
  CHILD_OVERVIEW_TEMPLATE,
  TOP_OVERVIEW_TEMPLATE,
} from "../../constants";
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

  const typeParam =
    searchParams.get("type") ||
    searchParams.get("from") ||
    (pathname !== "/metadata" &&
    pathname !== "/metadata/detail" &&
    pathname !== "/metadata/table-def"
      ? pathname.split("/").pop()
      : "臨床情報");

  const methods = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      dataType: typeParam || "臨床情報",
      overviewText: "",
      dataTypes: apiData?.overview?.dataTypes || [],
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
  const initialStorageDataRef = useRef<string | null>(null);

  useEffect(() => {
    if (!apiData || isInitialized) return;

    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    const saved = sessionStorage.getItem(storageKey);
    initialStorageDataRef.current = saved;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        try {
          const topSaved = sessionStorage.getItem("metadata_top");
          if (topSaved) {
            const parsedTop = JSON.parse(topSaved);
            if (parsedTop.dataTypes && parsedTop.dataTypes.length > 0) {
              parsed.dataTypes = parsedTop.dataTypes;
            }
          }
        } catch (e) {
          console.error(e);
        }
        methods.reset(parsed);
        setIsInitialized(true);
        return;
      } catch (e) {
        console.error("Failed to parse sessionStorage data", e);
      }
    }

    const OVERVIEW_TEMPLATE = isTopPage
      ? TOP_OVERVIEW_TEMPLATE
      : CHILD_OVERVIEW_TEMPLATE;

    methods.reset({
      dataType: typeParam || "臨床情報",
      overviewText: apiData.overview.overviewText || OVERVIEW_TEMPLATE,
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

  // フォームの変更状態をrefで追跡し、beforeunload/popstateハンドラで参照する
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (!isInitialized) return;
    const subscription = methods.watch(() => {
      isDirtyRef.current = true;
      const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
      sessionStorage.setItem(storageKey, JSON.stringify(methods.getValues()));
    });
    return () => subscription.unsubscribe();
  }, [methods, isInitialized, isTopPage, typeParam]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = () => {
      if (isDirtyRef.current) {
        const confirmed = window.confirm(
          "編集中の内容が破棄されますがよろしいですか？",
        );
        if (!confirmed) {
          // ブラウザバックをキャンセルし、現在のURLに戻す
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    // popstateキャンセル用に現在の履歴エントリを追加
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

  const [notification] = useState<NotificationState>(null);

  const handleSubmit = async (data: MetadataFormData) => {
    let finalData = data;

    if (isTopPage && data.dataTypes) {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const validNames = new Set(
          data.dataTypes.map((dt) => dt.name).filter(Boolean),
        );
        const validIds = new Set(
          data.dataTypes.map((dt) => dt.id).filter(Boolean),
        );

        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith("metadata_") && key !== "metadata_top") {
            const keyName = key.replace("metadata_", "");
            if (!validNames.has(keyName) && !validIds.has(keyName)) {
              keysToRemove.push(key);
            }
          }
        }
        keysToRemove.forEach((k) => {
          sessionStorage.removeItem(k);
        });
      }

      if (data.dataTypes.length > 0) {
        const updatedDataTypes = data.dataTypes.map((dt) => ({
          ...dt,
          id: dt.name,
        }));

        for (const dt of updatedDataTypes) {
          const targetId = dt.name;
          const isClinical = targetId === "臨床情報" || targetId === "clinical";

          // データ種別の初期データを作成・保存
          const childStorageKey = `metadata_${targetId}`;
          if (!sessionStorage.getItem(childStorageKey)) {
            const initialChildData = {
              dataType: targetId,
              overviewText: isClinical
                ? apiData.overview.overviewText
                : CHILD_OVERVIEW_TEMPLATE,
              dataTypes: updatedDataTypes,
              startYear: isClinical ? apiData.overview.startYear : "",
              latestYear: isClinical ? apiData.overview.latestYear : "",
              updateFrequencies: isClinical
                ? apiData.overview.updateFrequencies
                : [],
              tables: isClinical ? apiData.overview.tables : [],
              notesText: isClinical ? apiData.overview.notesText : "",
              keyInfoText: isClinical ? apiData.overview.keyInfoText : "",
              tableDefs: isClinical ? apiData.tableDefs : {},
            };
            sessionStorage.setItem(
              childStorageKey,
              JSON.stringify(initialChildData),
            );
          }
        }

        finalData = { ...data, dataTypes: updatedDataTypes };
      }
    }

    if (finalData.tables && finalData.tables.length > 0) {
      const updatedTableDefs = { ...(finalData.tableDefs || {}) };
      for (const t of finalData.tables) {
        if (
          t.physicalName &&
          (!updatedTableDefs[t.physicalName] ||
            updatedTableDefs[t.physicalName].length === 0)
        ) {
          updatedTableDefs[t.physicalName] =
            apiData.tableDefs?.[t.physicalName] || EXAMINATION_MOCK_DATA;
        }
      }
      finalData = { ...finalData, tableDefs: updatedTableDefs };
    }

    await saveMetadata(finalData);

    // 今回はバックエンド（DB）が存在しないモック環境のため、
    // 画面リロード時に編集内容が消えないようにセッションストレージにも保存しておく
    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    const serialized = JSON.stringify(finalData);
    sessionStorage.setItem(storageKey, serialized);
    initialStorageDataRef.current = serialized;

    if (isTopPage) {
      router.push("/metadata");
    } else if (subtabParam) {
      router.push(
        `/metadata/table-def?tab=${subtabParam}&from=${typeParam || "臨床情報"}`,
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

  const cancelParams = new URLSearchParams();
  cancelParams.set("tab", tabParam);
  if (typeParam) {
    cancelParams.set("type", typeParam);
  }
  const cancelHref = isTopPage
    ? "/metadata"
    : subtabParam
      ? `/metadata/table-def?tab=${subtabParam}&from=${searchParams.get("from") || "臨床情報"}`
      : `${pathname}?${cancelParams.toString()}`;

  const handleCancel = () => {
    const storageKey = isTopPage ? "metadata_top" : `metadata_${typeParam}`;
    if (initialStorageDataRef.current !== null) {
      sessionStorage.setItem(storageKey, initialStorageDataRef.current);
    } else {
      sessionStorage.removeItem(storageKey);
    }
    router.push(cancelHref);
  };

  const returnHref = null;
  const returnText = null;

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
