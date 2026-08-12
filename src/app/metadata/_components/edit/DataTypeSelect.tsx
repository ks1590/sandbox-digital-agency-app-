"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";
import { useDataTypes } from "../useDataTypes";

/**
 * データ種別セレクトボックス
 * 配下ページ（!isTopPage）の編集画面で表示されるデータ種別の選択UI
 */
export default function DataTypeSelect({ readonly }: { readonly?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, watch } = useFormContext<MetadataFormData>();
  const currentDataType = watch("dataType");
  const formDataTypes = watch("datatypeDataProductNames");
  const { datatypeDataProductNames, getDataTypeName } = useDataTypes(formDataTypes);

  const options = datatypeDataProductNames.some(
    (dt) =>
      dt.name === currentDataType ||
      dt.identifiler === currentDataType ||
      dt.name === getDataTypeName(currentDataType || ""),
  )
    ? datatypeDataProductNames
    : [
        ...datatypeDataProductNames,
        {
          identifiler: currentDataType || "default",
          name: currentDataType
            ? getDataTypeName(currentDataType) !== currentDataType
              ? getDataTypeName(currentDataType)
              : currentDataType
            : "臨床情報",
        },
      ];

  if (readonly) {
    const selectedOption = options.find(
      (opt) => opt.identifiler === currentDataType || opt.name === currentDataType,
    );
    return (
      <div className="mb-8">
        <p className="block text-xl font-bold text-gray-900 mb-2">データ種別</p>
        <p className="text-base text-gray-900">
          {selectedOption ? selectedOption.name : currentDataType}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <label
        htmlFor="globalDataType"
        className="block text-xl font-bold text-gray-900 mb-4"
      >
        データ種別
      </label>
      <div className="relative w-1/2 md:w-1/4 lg:w-1/6">
        <select
          id="globalDataType"
          className="w-full appearance-none rounded-[8px] border border-solid-gray-600 bg-white px-4 py-3 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
          value={currentDataType}
          onChange={(e) => {
            register("dataType").onChange(e);
            const newType = e.target.value;
            if (newType && newType !== currentDataType) {
              const params = new URLSearchParams(searchParams.toString());
              params.set("type", newType);
              router.push(`/metadata/detail?${params.toString()}`);
            }
          }}
        >
          {options.map((dt) => (
            <option key={dt.identifiler} value={dt.name}>
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
