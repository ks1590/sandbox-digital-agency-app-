"use client";

import { useState } from "react";

export default function TableDefinitionLinks() {
  const [linkedTables, setLinkedTables] = useState([
    { id: 1, physicalName: "disease", logicalName: "傷病" },
    { id: 2, physicalName: "allergy", logicalName: "薬剤・その他アレルギー等" },
    { id: 3, physicalName: "examination", logicalName: "感染症・検査" },
  ]);

  const handleAddTable = () => {
    setLinkedTables([
      ...linkedTables,
      { id: Date.now(), physicalName: "", logicalName: "" },
    ]);
  };

  const handleRemoveTable = (id: number) => {
    setLinkedTables(linkedTables.filter((table) => table.id !== id));
  };

  return (
    <div className="w-full max-w-[50%]">
      <button
        type="button"
        onClick={handleAddTable}
        className="mb-4 inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-[#0017C1] bg-white px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
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
                  {index === 0 && (
                    <label
                      htmlFor={`physical-name-${table.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル物理名
                    </label>
                  )}
                  <div className="relative">
                    <select
                      id={`physical-name-${table.id}`}
                      className="w-full appearance-none rounded-[8px] border border-solid-gray-600 bg-white px-4 py-3 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
                      defaultValue={table.physicalName}
                    >
                      <option value="">選択してください</option>
                      <option value="disease">condtion_table</option>
                      <option value="allergy">allergyIntoLerance_table</option>
                      <option value="examination">observation_table</option>
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
                  {index === 0 && (
                    <label
                      htmlFor={`logical-name-${table.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル論理名
                    </label>
                  )}
                  <div className="flex items-center gap-4">
                    <input
                      id={`logical-name-${table.id}`}
                      type="text"
                      defaultValue={table.logicalName}
                      className="w-full rounded-[8px] border border-solid-gray-600 bg-white px-4 py-3 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTable(table.id)}
                      className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] border border-red-600 bg-white px-4 py-2 text-base font-bold text-red-600 underline-offset-[3px] transition-colors hover:bg-red-50 hover:underline active:bg-red-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300 shrink-0"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
