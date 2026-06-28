'use client';

import React, { useState, useRef } from 'react';
import SortableTable from "../../components/ui/SortableTable";
import type { Column, RowData, ColumnGroup } from "../../components/ui/SortableTable";
import { Button } from "../../components/ui/Button";
import {
  ModalDialog,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
  ModalDialogBody,
  ModalDialogActions,
} from "../../components/ui/ModalDialog";
import {
  DatePicker,
  DatePickerYear,
  DatePickerMonth,
} from "../../components/form/DatePicker";
import data from './data.json';

export default function ExtractionStatusContent() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  );

  // 検索用ステート
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [filteredData, setFilteredData] = useState<RowData[]>(data.diseaseData);

  const handleOpenModal = (conditionText: string) => {
    setSelectedCondition(conditionText);
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setSelectedCondition(null);
  };

  const handleSearch = () => {
    let newData = data.diseaseData;
    if (yearInput) {
      newData = newData.filter((d) =>
        String(d.receptionDate).startsWith(yearInput),
      );
    }
    if (monthInput) {
      const formattedMonth = monthInput.padStart(2, '0');
      newData = newData.filter((d) => {
        const dateStr = String(d.receptionDate);
        return dateStr.substring(5, 7) === formattedMonth;
      });
    }
    setFilteredData(newData);
  };

  const handleReset = () => {
    setYearInput('');
    setMonthInput('');
    setFilteredData(data.diseaseData);
  };

  // -------------------------
  // 抽出状況テーブル定義
  // -------------------------
  const groups: ColumnGroup[] = [
    { label: '基本情報', colSpan: 3 },
    { label: '詳細情報', colSpan: 4 },
  ];

  const columns: Column[] = [
    {
      key: 'receptionDate',
      label: '受付日時',
      format: (val) => {
        const d = new Date(String(val));
        if (isNaN(d.getTime())) return String(val);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${day} ${h}:${min}`;
      },
    },
    { key: 'name', label: '傷病名' },
    { key: 'date', label: '診断日' },
    {
      key: 'condition',
      label: '抽出条件',
      format: (val) => (
        <button
          type='button'
          className='text-[#0017C1] underline hover:no-underline'
          onClick={() => handleOpenModal(String(val))}>
          表示
        </button>
      ),
    },
    { key: 'department', label: '診療科' },
    { key: 'doctor', label: '主治医' },
    { key: 'status', label: '状態' },
  ];

  return (
    <>
      <section className='mb-12'>
        <div className='mb-6 flex flex-wrap items-end gap-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-bold text-gray-900'>
              年月を指定して検索
            </span>
            <div className='flex items-center gap-2'>
              <DatePicker>
                {({ yearRef, monthRef }) => (
                  <>
                    <DatePickerYear
                      ref={yearRef}
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                    />
                    <DatePickerMonth
                      ref={monthRef}
                      value={monthInput}
                      onChange={(e) => setMonthInput(e.target.value)}
                    />
                  </>
                )}
              </DatePicker>
              <Button onClick={handleSearch} size='md' variant='solid-fill'>
                検索
              </Button>
              <Button onClick={handleReset} size='md' variant='outline'>
                リセット
              </Button>
            </div>
          </div>
        </div>

        <SortableTable groups={groups} columns={columns} data={filteredData} />
      </section>

      {/* 抽出条件表示用のモーダル */}
      <ModalDialog ref={dialogRef} aria-labelledby='condition-modal-title'>
        <ModalDialogContent>
          <ModalDialogHeader>
            <ModalDialogHeading id='condition-modal-title'>
              抽出条件詳細
            </ModalDialogHeading>
          </ModalDialogHeader>
          <ModalDialogBody>
            <React.Fragment key='.0'>
              {selectedCondition || '条件が設定されていません'}
            </React.Fragment>
          </ModalDialogBody>
          <ModalDialogActions className='flex justify-end'>
            <Button onClick={handleCloseModal} size='lg' variant='solid-fill'>
              OK
            </Button>
          </ModalDialogActions>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
}
