"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { ErrorText } from "@/components/ui/ErrorText/ErrorText";
import type { MetadataFormData } from "../schema";

const PHYSICAL_NAME_OPTIONS = [
  "condtion_table",
  "allergyIntolerance_table",
  "observation_table",
];

export default function TableDefinitionLinks() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<MetadataFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tables",
  });

  const watchTables = watch("tables") || [];

  // 全データ種別で選択済みの物理名を取得（個々のデータ種別ではなく全体で可変させる）
  const getAllSelectedPhysicalNames = (): string[] => {
    const selected = new Set<string>();

    // 1. 現在入力中のフォーム内の選択
    for (const t of watchTables) {
      if (t?.physicalName) {
        selected.add(t.physicalName);
      }
    }

    // 2. sessionStorage 内の全データ種別 (metadata_*) から選択値を収集
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith("metadata_") && key !== "metadata_top") {
            const raw = sessionStorage.getItem(key);
            if (raw) {
              const data = JSON.parse(raw);
              if (Array.isArray(data?.tables)) {
                for (const t of data.tables) {
                  if (t?.physicalName) {
                    selected.add(t.physicalName);
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.error(
          "Error reading selected physical names from sessionStorage",
          e,
        );
      }
    }

    return Array.from(selected);
  };

  const selectedPhysicalNames = getAllSelectedPhysicalNames();

  const handleAddTable = () => {
    append({
      id: String(Date.now()),
      physicalName: "",
      logicalName: "",
      overview: "",
      unit: "",
    });
  };

  return (
    <div className="w-full max-w-3xl">
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={handleAddTable}
        className="mb-4"
      >
        ＋ テーブル定義と紐づける
      </Button>

      {fields.length > 0 && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {index === 0 && (
                    <label
                      htmlFor={`physical-name-${field.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル物理名
                    </label>
                  )}
                  {(() => {
                    const errorMessage =
                      errors?.tables?.[index]?.physicalName?.message;
                    return (
                      <div className="flex flex-col gap-1 w-full">
                        <div className="relative">
                          <select
                            id={`physical-name-${field.id}`}
                            className={`w-full appearance-none rounded-[8px] border bg-white px-4 py-3 pr-10 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300 ${
                              errorMessage
                                ? "border-red-600 focus:ring-red-300"
                                : "border-solid-gray-600"
                            }`}
                            aria-invalid={!!errorMessage}
                            {...register(
                              `tables.${index}.physicalName` as const,
                            )}
                          >
                            <option value="">選択してください</option>
                            {PHYSICAL_NAME_OPTIONS.filter(
                              (opt) =>
                                !selectedPhysicalNames.includes(opt) ||
                                watchTables[index]?.physicalName === opt,
                            ).map((option) => (
                              <option key={option} value={option}>
                                {option}
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
                        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  {index === 0 && (
                    <label
                      htmlFor={`logical-name-${field.id}`}
                      className="mb-2 block text-sm font-bold text-gray-900"
                    >
                      テーブル論理名
                    </label>
                  )}
                  {(() => {
                    const errorMessage =
                      errors?.tables?.[index]?.logicalName?.message;
                    return (
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-4">
                          <input
                            id={`logical-name-${field.id}`}
                            type="text"
                            className={`w-full rounded-[8px] border bg-white px-4 py-3 text-base text-gray-900 focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-yellow-300 ${
                              errorMessage
                                ? "border-red-600 focus:ring-red-300"
                                : "border-solid-gray-600"
                            }`}
                            aria-invalid={!!errorMessage}
                            {...register(
                              `tables.${index}.logicalName` as const,
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => remove(index)}
                            className="!border-[#D91A2A] !text-[#D91A2A] hover:!text-[#D91A2A] hover:bg-red-50 active:bg-red-100 shrink-0 whitespace-nowrap"
                          >
                            削除
                          </Button>
                        </div>
                        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
