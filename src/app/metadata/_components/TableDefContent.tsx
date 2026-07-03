'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Tab from '../../../components/ui/Tab';
import { Input } from '../../../components/form/Input';
import { DataTable, type ColumnDef } from '../../../components/ui/DataTable/DataTable';
import LinkCard from '../../../components/ui/LinkCard';

interface TableDefRow {
  id: number;
  physicalName: string;
  dataType: string;
  length: number | string;
  required: string;
  logicalName: string;
  description: string;
  foreignKey: string;
  masterType: string;
  sampleData: string;
}

function PopoverTextarea({
  defaultValue,
  placeholder,
  ariaLabel,
  className,
}: {
  defaultValue: string;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Input
        blockSize="md"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pr-8"
        onFocus={() => setExpanded(true)}
      />
      {/* 展開アイコン（ヒント用） */}
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>

      {expanded && (
        <div className="absolute top-0 left-0 w-[300px] bg-white border border-gray-400 rounded-lg shadow-xl z-50 p-3 ring-4 ring-black ring-offset-2 ring-yellow-300">
          <textarea
            className="w-full min-h-[160px] resize-y outline-none focus:ring-0 text-base p-2 border border-gray-300 rounded"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            aria-label={ariaLabel}
            autoFocus
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#0017C1] text-white rounded font-bold text-sm hover:bg-[#1A30C9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
              onClick={() => setExpanded(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DUMMY_DATA: TableDefRow[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  physicalName: 'sample',
  dataType: 'VARCHAR',
  length: 100,
  required: '必須',
  logicalName: 'サンプル',
  description: 'これはデザインの見本',
  foreignKey: 'キー',
  masterType: '',
  sampleData: '',
}));

export function TableDefGrid() {
  const columns: ColumnDef<TableDefRow>[] = [
    {
      key: 'rowNumber',
      label: '項番',
      render: (_row, idx) => idx + 1,
    },
    { key: 'physicalName', label: '物理名' },
    { key: 'dataType', label: 'データ型' },
    { key: 'length', label: '桁数' },
    { key: 'required', label: '必須/任意' },
    {
      key: 'logicalName',
      label: '論理名',
      render: (row) => (
        <Input
          blockSize="md"
          defaultValue={row.logicalName}
          placeholder="入力テキスト"
          className="min-w-[120px]"
          aria-label={`論理名（項番${row.id}）`}
        />
      ),
    },
    {
      key: 'description',
      label: '項目説明',
      render: (row) => (
        <PopoverTextarea
          defaultValue={row.description}
          placeholder="項目説明を入力"
          className="min-w-[200px]"
          ariaLabel={`項目説明（項番${row.id}）`}
        />
      ),
    },
    {
      key: 'foreignKey',
      label: '外部キー',
      render: (row) => (
        <Input
          blockSize="md"
          defaultValue={row.foreignKey}
          placeholder="入力テキスト"
          className="min-w-[120px]"
          aria-label={`外部キー（項番${row.id}）`}
        />
      ),
    },
    {
      key: 'masterType',
      label: 'マスタ種別',
      render: (row) => (
        <Input
          blockSize="md"
          defaultValue={row.masterType}
          placeholder="入力テキスト"
          className="min-w-[120px]"
          aria-label={`マスタ種別（項番${row.id}）`}
        />
      ),
    },
    {
      key: 'sampleData',
      label: 'サンプルデータ',
      render: (row) => (
        <PopoverTextarea
          defaultValue={row.sampleData}
          placeholder="サンプルデータを入力"
          className="min-w-[150px]"
          ariaLabel={`サンプルデータ（項番${row.id}）`}
        />
      ),
    },
  ];

  return (
    <div className="mt-4">
      <DataTable
        data={DUMMY_DATA}
        columns={columns}
        rowKey={(row) => row.id}
      />
    </div>
  );
}

export default function TableDefContent() {
  const pathname = usePathname();

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=disease`}
          title="傷病"
        />
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=allergy`}
          title="アレルギー"
        />
        <LinkCard
          href={`${pathname}?mode=edit&tab=table-def&subtab=examination`}
          title="検査"
        />
      </div>
    </div>
  );
}
