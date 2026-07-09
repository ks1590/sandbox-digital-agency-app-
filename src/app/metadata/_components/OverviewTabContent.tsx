"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import DataTypeListEditor from "./DataTypeListEditor";
import KeyInfoSection from "./KeyInfoSection";
import type { MetadataFormData } from "./schema";
import { inputClass, labelClass, textareaClass } from "./styles";

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

  const { fields: tableFields } = useFieldArray({
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label htmlFor="startYear" className={labelClass}>
                  収集開始年度
                </label>
                <input
                  type="text"
                  id="startYear"
                  className={inputClass}
                  {...register("startYear")}
                />
              </div>
              <div>
                <label htmlFor="latestYear" className={labelClass}>
                  最新の提供可能年度
                </label>
                <input
                  type="text"
                  id="latestYear"
                  className={inputClass}
                  {...register("latestYear")}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">更新頻度</h3>
            <button
              type="button"
              onClick={() => appendFreq({ target: "", frequency: "" })}
              className="mb-4 inline-flex items-center gap-2 px-4 py-2 border border-solid-gray-420 rounded-md bg-white text-gray-900 hover:bg-gray-50 font-bold text-sm"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              追加
            </button>
            <div className="space-y-4 max-h-80 overflow-y-auto p-2 -m-2">
              {freqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-4 items-center"
                >
                  <div className="flex-1 w-full">
                    <label htmlFor={`freq-target-${index}`} className="sr-only">
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
                      className="sr-only"
                    >
                      頻度
                    </label>
                    <input
                      type="text"
                      id={`freq-frequency-${index}`}
                      placeholder="頻度（例: 月1回）"
                      className={inputClass}
                      {...register(`updateFrequencies.${index}.frequency`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFreq(index)}
                    className="p-2 text-error-1 hover:text-red-800 focus:outline-none"
                    aria-label={`更新頻度 ${index + 1} を削除`}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
            <div className="space-y-8">
              {tableFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-6 bg-gray-50"
                >
                  <h4 className="text-lg text-gray-900 font-bold mb-4 border-l-4 border-[#0017C1] pl-3">
                    {field.name}
                  </h4>
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
                      <input
                        type="text"
                        id={`table-${index}-unit`}
                        className={inputClass}
                        {...register(`tables.${index}.unit`)}
                      />
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
