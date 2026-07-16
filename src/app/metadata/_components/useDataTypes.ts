"use client";

import { useEffect, useState } from "react";
import type { DataTypeItem } from "../types";

/**
 * sessionStorage の metadata_top（Topページで編集されたメタデータ）から
 * データ種別の一覧を取得し、最新のデータ種別名を解決するためのフック
 */
export function useDataTypes(initialDataTypes?: DataTypeItem[]) {
  const [dataTypes, setDataTypes] = useState<DataTypeItem[]>(
    initialDataTypes || [{ id: "clinical", name: "臨床情報" }],
  );

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("metadata_top");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dataTypes && parsed.dataTypes.length > 0) {
          setDataTypes(parsed.dataTypes);
        }
      }
    } catch (e) {
      console.error("Failed to parse metadata_top from sessionStorage", e);
    }
  }, []);

  const getDataTypeName = (id: string) => {
    const found = dataTypes.find((dt) => dt.id === id);
    return found ? found.name : id;
  };

  return { dataTypes, getDataTypeName };
}
