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
        <Input
          blockSize="md"
          defaultValue={row.description}
          placeholder="入力テキスト"
          className="min-w-[200px]"
          aria-label={`項目説明（項番${row.id}）`}
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
        <Input
          blockSize="md"
          defaultValue={row.sampleData}
          placeholder="入力テキスト"
          className="min-w-[120px]"
          aria-label={`サンプルデータ（項番${row.id}）`}
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
