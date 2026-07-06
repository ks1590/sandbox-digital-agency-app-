"use client";

import Link from "next/link";
import { inputClass } from "./styles";

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
    onChange([...dataTypes, { id: newId, name: "新しいデータ種別" }]);
  };

  return (
    <section>
      <h3 className="text-xl font-bold mb-4">データ種別</h3>
      <div className="space-y-4">
        {dataTypes.map((dt, idx) => (
          <div key={dt.id} className="flex items-center gap-4">
            <input
              type="text"
              value={dt.name}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              className={inputClass}
            />
            <Link
              href={`/metadata/${dt.id}?mode=edit`}
              className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-white border-2 border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-[2px] focus-visible:ring-yellow-300 whitespace-nowrap"
            >
              詳細
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="inline-flex items-center justify-center min-w-[80px] min-h-[44px] rounded-[8px] bg-white border border-gray-400 px-4 py-2 text-base font-bold text-error-1 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-[2px] focus-visible:ring-yellow-300 whitespace-nowrap"
            >
              削除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center mt-4 min-h-[44px] rounded-[8px] border-2 border-dashed border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 px-4 py-2 text-base font-bold transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-[2px] focus-visible:ring-yellow-300 w-full"
        >
          ＋ データ種別を追加
        </button>
      </div>
    </section>
  );
}
