"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";
import { inputClass, labelClass, textareaClass } from "../styles";
import DataTypeListEditor from "./DataTypeListEditor";
import KeyInfoSection from "./KeyInfoSection";

interface OverviewTabContentProps {
  /** /metadata 直下の編集画面かどうか */
  isTopPage: boolean;
}

/**
 * 概要タブのコンテンツ
 */
export default function OverviewTabContent({
  isTopPage,
}: OverviewTabContentProps) {
  const { register, control, watch, setValue } =
    useFormContext<MetadataFormData>();

  const dataTypes = watch("dataTypes") || [];

  const {
    fields: freqFields,
    append: appendFreq,
    remove: removeFreq,
  } = useFieldArray({
    control,
    name: "updateFrequencies",
  });

  const {
    fields: tableFields,
    append: appendTable,
    remove: removeTable,
  } = useFieldArray({
    control,
    name: "tables",
  });

  return (
    <div className="space-y-10 py-6">
      {/* データ種別セレクト（配下ページのみ） */}
      {/* セレクトボックスは共通要素として親（MetadataEdit）に移動しました */}

      {/* 概要 */}
      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <label htmlFor="overviewText" className="sr-only">
          概要の説明
        </label>
        <textarea
          id="overviewText"
          className={textareaClass}
          {...register("overviewText")}
        />
      </section>

      {/* データ種別エディタ（トップページのみ） */}
      {isTopPage && (
        <DataTypeListEditor
          dataTypes={dataTypes}
          onChange={(val) => setValue("dataTypes", val, { shouldDirty: true })}
        />
      )}

      {/* 配下ページ専用セクション */}
      {!isTopPage && (
        <>
          <section>
            <h3 className="text-xl font-bold mb-4">収集期間</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label htmlFor="startYear" className={labelClass}>
                  収集開始年度
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-64">
                    <input
                      type="text"
                      id="startYear"
                      className={inputClass}
                      {...register("startYear")}
                    />
                  </div>
                  <span className="text-gray-900 font-bold">年</span>
                </div>
              </div>
              <div>
                <label htmlFor="latestYear" className={labelClass}>
                  最新の提供可能年度
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-64">
                    <input
                      type="text"
                      id="latestYear"
                      className={inputClass}
                      {...register("latestYear")}
                    />
                  </div>
                  <span className="text-gray-900 font-bold">年</span>
                </div>
              </div>
              <div>
                <label htmlFor="collectionFrequency" className={labelClass}>
                  収集頻度
                </label>
                <div className="relative inline-block w-64">
                  <select
                    id="collectionFrequency"
                    className="block w-full h-12 appearance-none border border-gray-400 rounded-md bg-white pl-4 pr-10 text-sm text-gray-900 hover:border-black focus:outline focus:outline-2 focus:outline-black focus:outline-offset-[2px]"
                    {...register("collectionFrequency")}
                  >
                    <option value="">選択してください</option>
                    <option value="年次">年次</option>
                    <option value="月次">月次</option>
                    <option value="日次">日次</option>
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
                    fill="none"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <path
                      d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">更新頻度</h3>
            <button
              type="button"
              onClick={() => appendFreq({ target: "", frequency: "" })}
              className="mb-4 inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              ＋ 対象項目・頻度を追加
            </button>
            <div className="space-y-4 max-h-80 overflow-y-auto p-2 -m-2">
              {freqFields.map((field, index) => (
                <div
                  key={field.id}
                  className={`flex flex-col sm:flex-row gap-4 ${index === 0 ? "items-end" : "items-center"}`}
                >
                  <div className="flex-1 w-full">
                    <label htmlFor={`freq-target-${index}`} className={index === 0 ? labelClass : "sr-only"}>
                      対象項目
                    </label>
                    <input
                      type="text"
                      id={`freq-target-${index}`}
                      placeholder="対象項目（例: 検査結果）"
                      className={inputClass}
                      {...register(`updateFrequencies.${index}.target`)}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label
                      htmlFor={`freq-frequency-${index}`}
                      className={index === 0 ? labelClass : "sr-only"}
                    >
                      頻度
                    </label>
                    <div className="relative inline-block w-full">
                      <select
                        id={`freq-frequency-${index}`}
                        className="block w-full h-12 appearance-none border border-gray-400 rounded-md bg-white pl-4 pr-10 text-sm text-gray-900 hover:border-black focus:outline focus:outline-2 focus:outline-black focus:outline-offset-[2px]"
                        {...register(`updateFrequencies.${index}.frequency`)}
                      >
                        <option value="">選択してください</option>
                        <option value="月次">月次</option>
                        <option value="年次">年次</option>
                      </select>
                      <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
                        fill="none"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                      >
                        <path
                          d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFreq(index)}
                    className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-error-1 px-4 py-2 text-base font-bold text-error-1 underline-offset-[3px] transition-colors hover:bg-red-50 hover:underline active:bg-red-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300 whitespace-nowrap"
                    aria-label={`更新頻度 ${index + 1} を削除`}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">テーブル一覧</h3>
            <button
              type="button"
              onClick={() =>
                appendTable({ id: "", physicalName: "", logicalName: "", overview: "", unit: "" })
              }
              className="mb-4 inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              ＋ テーブル定義と紐づける
            </button>
            <div className="space-y-8">
              {tableFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-6 bg-gray-50 relative"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor={`table-${index}-physicalName`}
                        className={labelClass}
                      >
                        テーブル物理名
                      </label>
                      <div className="relative inline-block w-full">
                        <select
                          id={`table-${index}-physicalName`}
                          className="block w-full h-12 appearance-none border border-gray-400 rounded-md bg-white pl-4 pr-10 text-sm text-gray-900 hover:border-black focus:outline focus:outline-2 focus:outline-black focus:outline-offset-[2px]"
                          {...register(`tables.${index}.physicalName`)}
                        >
                          <option value="">選択してください</option>
                          <option value="table_name">table_name</option>
                          <option value="table_name2">table_name2</option>
                          <option value="table_name3">table_name3</option>
                        </select>
                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
                          fill="none"
                          height="16"
                          viewBox="0 0 16 16"
                          width="16"
                        >
                          <path
                            d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`table-${index}-logicalName`}
                        className={labelClass}
                      >
                        テーブル論理名
                      </label>
                      <input
                        type="text"
                        id={`table-${index}-logicalName`}
                        placeholder="テーブル論理名"
                        className={inputClass}
                        {...register(`tables.${index}.logicalName`)}
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor={`table-${index}-overview`}
                        className={labelClass}
                      >
                        概要
                      </label>
                      <textarea
                        id={`table-${index}-overview`}
                        className={textareaClass}
                        {...register(`tables.${index}.overview`)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`table-${index}-unit`}
                        className={labelClass}
                      >
                        格納単位
                      </label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 w-full max-w-sm">
                          <input
                            type="text"
                            id={`table-${index}-unit`}
                            className={inputClass}
                            {...register(`tables.${index}.unit`)}
                          />
                        </div>
                        <div className="flex-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeTable(index)}
                            className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-error-1 px-4 py-2 text-base font-bold text-error-1 underline-offset-[3px] transition-colors hover:bg-red-50 hover:underline active:bg-red-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300 whitespace-nowrap"
                            aria-label={`テーブル ${index + 1} を削除`}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">留意事項</h3>
            <label htmlFor="notesText" className="sr-only">
              留意事項
            </label>
            <textarea
              id="notesText"
              className={textareaClass}
              {...register("notesText")}
            />
          </section>
        </>
      )}

      {/* キー情報（共通） */}
      <KeyInfoSection />
    </div>
  );
}
