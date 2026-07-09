"use client";

import { useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";

/**
 * データ種別セレクトボックス
 * 配下ページ（!isTopPage）の編集画面で表示されるデータ種別の選択UI
 */
export default function DataTypeSelect() {
  const { register, watch } = useFormContext<MetadataFormData>();
  const watchDataTypes = watch("dataTypes");

  const options =
    watchDataTypes && watchDataTypes.length > 0
      ? watchDataTypes
      : [
          { id: "clinical", name: "臨床情報" },
          { id: "document", name: "ドキュメント" },
        ];

  return (
    <div className="mb-8">
      <label
        htmlFor="globalDataType"
        className="block text-sm font-bold text-gray-900 mb-2"
      >
        データ種別
      </label>
      <div className="relative w-full md:w-1/2 lg:w-1/3">
        <select
          id="globalDataType"
          className="w-full appearance-none rounded-[8px] border border-solid-gray-600 bg-white px-4 py-3 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
          {...register("dataType")}
        >
          {options.map((dt) => (
            <option key={dt.id} value={dt.id}>
              {dt.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg
            className="h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
