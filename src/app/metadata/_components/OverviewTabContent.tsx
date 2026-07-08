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

  const { fields: freqFields } = useFieldArray({
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="py-3 px-4 text-left font-bold text-gray-900 border-r border-gray-300 w-1/2">
                      対象項目
                    </th>
                    <th className="py-3 px-4 text-left font-bold text-gray-900 w-1/2">
                      頻度
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {freqFields.map((field, index) => (
                    <tr key={field.id} className="border-b border-gray-200">
                      <td className="py-3 px-4 border-r border-gray-200">
                        <input
                          type="text"
                          aria-label={`対象項目${index + 1}`}
                          className={inputClass}
                          {...register(`updateFrequencies.${index}.target`)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          aria-label={`頻度${index + 1}`}
                          className={inputClass}
                          {...register(`updateFrequencies.${index}.frequency`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
