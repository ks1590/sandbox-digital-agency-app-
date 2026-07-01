"use client";

import React, { useState } from "react";
import Tab from "../../components/ui/Tab";
import { DataTable, type ColumnDef } from '../../components/ui/DataTable';

interface DataProfileRow {
  id: number;
  columnName: string;
  maxLength: number;
  avgLength: number;
  distinctCount: number;
  maxValue: number;
  minValue: number;
  validRatio: string;
  invalidRatio: string;
  nullRatio: string;
}

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

const DUMMY_DATA: DataProfileRow[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  columnName: "sample",
  maxLength: 10,
  avgLength: 10,
  distinctCount: 100,
  maxValue: 99999,
  minValue: 1,
  validRatio: "99.8%",
  invalidRatio: "0.1%",
  nullRatio: "0.1%",
}));

function DataProfileGrid() {
  const columns: ColumnDef<DataProfileRow>[] = [
    {
      key: 'rowNumber',
      label: '項番',
      render: (_row, idx) => idx + 1,
    },
    { key: 'columnName', label: '列の名前' },
    { key: 'maxLength', label: '最大長' },
    { key: 'avgLength', label: '平均長' },
    { key: 'distinctCount', label: '個別値の数' },
    { key: 'maxValue', label: '最大値' },
    { key: 'minValue', label: '最小値' },
    { key: 'validRatio', label: '有効値割合' },
    { key: 'invalidRatio', label: '無効値割合' },
    { key: 'nullRatio', label: 'null値割合' },
  ];

  return (
    <div className="py-6">
      <div className="flex gap-8 mb-4 text-base font-bold text-gray-900">
        <p>合計行数：500件</p>
        <p>合計ファイル数：100件</p>
      </div>

      <DataTable
        data={DUMMY_DATA}
        columns={columns}
        rowKey={(row) => row.id}
      />
    </div>
  );
}

export default function DataProfileContent() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-2">集計対象期間</h3>
        <p className="text-base text-gray-900 font-bold">
          2026年4月 <span className="mx-2 font-normal">から</span> 2026年6月
        </p>
      </div>

      <Tab
        headingId="data-profile-tabs-heading"
        items={[
          {
            label: "傷病名",
            id: "tab-disease",
            content: <DataProfileGrid />,
          },
          {
            label: "薬剤・その他アレルギー等",
            id: "tab-allergy",
            content: <DataProfileGrid />,
          },
          {
            label: "感染症・検査",
            id: "tab-examination",
            content: <DataProfileGrid />,
          },
        ]}
      />
    </>
  );
}
