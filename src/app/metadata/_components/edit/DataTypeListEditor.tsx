"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { ErrorText } from "@/components/ui/ErrorText/ErrorText";
import type { MetadataFormData } from "../schema";
import { inputClass } from "../styles";

interface DataType {
  id: string;
  name: string;
}

interface DataTypeListEditorProps {
  dataTypes: DataType[];
  onChange: (dataTypes: DataType[]) => void;
}

/**
 * データ種別の編集リスト
 *
 * 各データ種別に対して、名前変更・削除を行える。
 * 新規データ種別の追加も可能。
 */
export default function DataTypeListEditor({
  dataTypes,
  onChange,
}: DataTypeListEditorProps) {
  const formContext = useFormContext<MetadataFormData>();
  const errors = formContext?.formState?.errors;

  const handleNameChange = (idx: number, name: string) => {
    const newTypes = [...dataTypes];
    newTypes[idx] = { ...newTypes[idx], name };
    onChange(newTypes);
  };

  const handleRemove = (idx: number) => {
    const target = dataTypes[idx];
    if (target && typeof window !== "undefined" && window.sessionStorage) {
      try {
        if (target.name) {
          sessionStorage.removeItem(`metadata_${target.name}`);
        }
        if (target.id) {
          sessionStorage.removeItem(`metadata_${target.id}`);
        }
      } catch (e) {
        console.error("Failed to remove metadata from sessionStorage", e);
      }
    }
    const newTypes = [...dataTypes];
    newTypes.splice(idx, 1);
    onChange(newTypes);
  };

  const handleAdd = () => {
    const newId = `new-type-${Date.now()}`;
    onChange([...dataTypes, { id: newId, name: "" }]);
  };

  return (
    <section>
      <h3 className="text-xl font-bold mb-4">データ種別</h3>
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={handleAdd}
        className="mb-4"
      >
        ＋ データ種別を追加
      </Button>
      {dataTypes.length > 0 && (
        <p className="text-sm font-bold mb-2">データ種別名</p>
      )}
      <div className="space-y-4">
        {dataTypes.map((dt, idx) => {
          const errorMessage = errors?.dataTypes?.[idx]?.name?.message;
          return (
            <div key={dt.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div className="w-[300px]">
                  <input
                    type="text"
                    value={dt.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className={`${inputClass} ${errorMessage ? "border-red-600 focus:ring-red-300" : ""}`}
                    aria-invalid={!!errorMessage}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => handleRemove(idx)}
                  className="!border-[#D91A2A] !text-[#D91A2A] hover:!text-[#D91A2A] hover:bg-red-50 active:bg-red-100 whitespace-nowrap"
                >
                  削除
                </Button>
              </div>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
