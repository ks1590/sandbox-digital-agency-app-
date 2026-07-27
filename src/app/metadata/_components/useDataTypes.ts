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
    const parsed = JSON.parse(serializedInitialDataTypes) as DataTypeItem[];
    if (parsed.length > 0) {
      setDataTypes((prev) => {
        const merged = [...prev];
        for (const item of parsed) {
          if (!merged.some((dt) => dt.id === item.id || dt.name === item.name)) {
            merged.push(item);
          }
        }
        return merged;
      });
    }
  }, [serializedInitialDataTypes]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("metadata_top");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dataTypes && parsed.dataTypes.length > 0) {
          setDataTypes((prev) => {
            const merged = [...prev];
            for (const item of parsed.dataTypes as DataTypeItem[]) {
              if (!merged.some((dt) => dt.id === item.id || dt.name === item.name)) {
                merged.push(item);
              }
            }
            return merged;
          });
        }
      }
    } catch (e) {
      console.error("Failed to parse metadata_top from sessionStorage", e);
    }
  }, []);

  const getDataTypeName = (idOrName: string) => {
    if (idOrName === "clinical") return "臨床情報";
    const found = dataTypes.find(
      (dt) => dt.id === idOrName || dt.name === idOrName,
    );
    return found ? found.name : idOrName;
  };

  return { dataTypes, getDataTypeName };
}
