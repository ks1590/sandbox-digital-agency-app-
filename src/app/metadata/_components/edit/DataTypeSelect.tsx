"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";

/**
 * データ種別セレクトボックス
 * 配下ページ（!isTopPage）の編集画面で表示されるデータ種別の選択UI
 */
export default function DataTypeSelect() {
  const { register, watch } = useFormContext<MetadataFormData>();
  const watchDataTypes = watch("dataTypes");
  const [linkedTables, setLinkedTables] = useState([
    { id: 1, physicalName: "", logicalName: "傷病" },
  ]);

  const handleAddTable = () => {
    setLinkedTables([
      ...linkedTables,
      { id: Date.now(), physicalName: "", logicalName: "" },
    ]);
  };

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
        className="block text-xl font-bold text-gray-900 mb-4"
      >
        データ種別
      </label>
      <div className="relative w-1/2 md:w-1/4 lg:w-1/6">
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

      {/* テーブル定義と紐づける機能 */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleAddTable}
          className="mb-4 inline-flex items-center rounded bg-white px-4 py-2 text-sm font-bold text-blue-700 border border-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="mr-1 text-lg font-normal">＋</span>{" "}
          テーブル定義と紐づける
        </button>

        {linkedTables.length > 0 && (
          <div className="space-y-4">
            {linkedTables.map((table, index) => (
              <div key={table.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* テーブル物理名 */}
                  <div>
                    <label
                      htmlFor={`physical-name-${table.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル物理名
                    </label>
                    <div className="relative">
                      <select
                        id={`physical-name-${table.id}`}
                        className="w-full appearance-none rounded-[4px] border border-gray-400 bg-white px-4 py-2 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        defaultValue={table.physicalName}
                      >
                        <option value="">選択してください</option>
                        <option value="disease">disease</option>
                        <option value="allergy">allergy</option>
                        <option value="examination">examination</option>
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

                  {/* テーブル論理名 */}
                  <div>
                    <label
                      htmlFor={`logical-name-${table.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル論理名
                    </label>
                    <input
                      id={`logical-name-${table.id}`}
                      type="text"
                      defaultValue={table.logicalName}
                      className="w-full rounded-[4px] border border-gray-400 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
