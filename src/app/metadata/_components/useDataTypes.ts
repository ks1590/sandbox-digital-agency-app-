"use client";

import { useEffect, useState } from "react";
import type { DataTypeItem } from "../types";

/**
 * sessionStorage の metadata_top（Topページで編集されたメタデータ）から
 * データ種別の一覧を取得し、最新のデータ種別名を解決するためのフック
 */
export function useDataTypes(initialDataTypes?: DataTypeItem[]) {
  const [dataTypes, setDataTypes] = useState<DataTypeItem[]>(
    initialDataTypes || [{ id: "臨床情報", name: "臨床情報" }],
  );

  const serializedInitialDataTypes = JSON.stringify(initialDataTypes || []);

  useEffect(() => {
    let baseList =
      (JSON.parse(serializedInitialDataTypes) as DataTypeItem[]) || [];

    try {
      const saved =
        typeof window !== "undefined"
          ? sessionStorage.getItem("metadata_top")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.dataTypes &&
          Array.isArray(parsed.dataTypes) &&
          parsed.dataTypes.length > 0
        ) {
          if (parsed.dataTypes.length >= baseList.length) {
            baseList = parsed.dataTypes;
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse metadata_top from sessionStorage", e);
    }

    if (baseList.length > 0) {
      setDataTypes(baseList);
    }
  }, [serializedInitialDataTypes]);

  const getDataTypeName = (idOrName: string) => {
    if (idOrName === "clinical") return "臨床情報";
    const found = dataTypes.find(
      (dt) => dt.id === idOrName || dt.name === idOrName,
    );
    return found ? found.name : idOrName;
  };

  return { dataTypes, getDataTypeName };
}
