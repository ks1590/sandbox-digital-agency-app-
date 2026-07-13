"use client";

import Link from "next/link";
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
 * 各データ種別に対して、名前変更・詳細遷移・削除を行える。
 * 新規データ種別の追加も可能。
 */
export default function DataTypeListEditor({
  dataTypes,
  onChange,
}: DataTypeListEditorProps) {
  const handleNameChange = (idx: number, name: string) => {
    const newTypes = [...dataTypes];
    newTypes[idx] = { ...newTypes[idx], name };
    onChange(newTypes);
  };

  const handleRemove = (idx: number) => {
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
      <button
        type="button"
        onClick={handleAdd}
        className="mb-4 inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
      >
        ＋ データ種別を追加
      </button>
      <p className="text-sm font-bold mb-2">データ種別名</p>
      <div className="space-y-4">
        {dataTypes.map((dt, idx) => (
          <div key={dt.id} className="flex items-center gap-4">
            <div className="w-[300px]">
              <input
                type="text"
                value={dt.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
                className={inputClass}
              />
            </div>
            <Link
              href={`/metadata/${dt.id}?mode=edit`}
              className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300 whitespace-nowrap"
            >
              詳細
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="inline-flex items-center justify-center min-w-[96px] min-h-[48px] rounded-[8px] bg-white border border-[#D91A2A] px-4 py-2 text-base font-bold text-[#D91A2A] underline-offset-[3px] transition-colors hover:bg-red-50 hover:underline active:bg-red-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300 whitespace-nowrap"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
