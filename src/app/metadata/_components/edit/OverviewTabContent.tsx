"use client";

import dynamic from "next/dynamic";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";
import { inputClass, labelClass, textareaClass } from "../styles";
import DataTypeListEditor from "./DataTypeListEditor";
import KeyInfoSection from "./KeyInfoSection";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), {
  ssr: false,
});

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
      {/* 概要 */}
      <section>
        <label htmlFor="overviewText" className="sr-only">
          概要の説明
        </label>
        <Controller
          name="overviewText"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MarkdownEditor markdown={value || ""} onChange={onChange} />
          )}
        />
      </section>

      {/* データ種別エディタ（トップページのみ） */}
      {isTopPage && (
        <DataTypeListEditor
          dataTypes={dataTypes}
          onChange={(val) => setValue("dataTypes", val, { shouldDirty: true })}
        />
      )}
    </div>
  );
}
