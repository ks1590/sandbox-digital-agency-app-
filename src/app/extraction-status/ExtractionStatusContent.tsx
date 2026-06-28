"use client";

import React, { useState, useRef } from "react";
import SortableTable from "../components/SortableTable";
import type { Column, RowData, ColumnGroup } from "../components/SortableTable";
import Tab from "../components/Tab";
import { Button } from "../components/Button";
import {
  ModalDialog,
  ModalDialogContent,
  ModalDialogHeader,
  ModalDialogHeading,
  ModalDialogBody,
  ModalDialogActions,
} from "../components/ModalDialog";

export default function ExtractionStatusContent() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  );

  const handleOpenModal = (conditionText: string) => {
    setSelectedCondition(conditionText);
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setSelectedCondition(null);
  };

  // -------------------------
  // 傷病テーブル定義
  // -------------------------
  const diseaseGroups: ColumnGroup[] = [
    { label: "基本情報", colSpan: 2 },
    { label: "診療情報", colSpan: 4 }, // "抽出条件"が増えるので +1
  ];

  const diseaseColumns: Column[] = [
    { key: "name", label: "傷病名" },
    { key: "date", label: "診断日" },
    {
      key: "condition",
      label: "抽出条件",
      format: (val) => (
        <button
          type="button"
          className="text-[#0017C1] underline hover:no-underline"
          onClick={() => handleOpenModal(String(val))}
        >
          表示
        </button>
      ),
    },
    { key: "department", label: "診療科" },
    { key: "doctor", label: "主治医" },
    { key: "status", label: "状態" },
  ];

  const diseaseData: RowData[] = [
    {
      name: "2型糖尿病",
      date: "2024/03/15",
      condition: "HbA1c >= 6.5% かつ 空腹時血糖 >= 126mg/dL の患者",
      department: "内科",
      doctor: "田中 太郎",
      status: "治療中",
    },
    {
      name: "高血圧症",
      date: "2023/08/22",
      condition: "収縮期血圧 >= 140mmHg または 拡張期血圧 >= 90mmHg の患者",
      department: "循環器内科",
      doctor: "鈴木 花子",
      status: "治療中",
    },
    {
      name: "腰椎椎間板ヘルニア",
      date: "2025/01/10",
      condition: "MRI画像所見あり、保存的治療中の患者",
      department: "整形外科",
      doctor: "佐藤 健一",
      status: "経過観察",
    },
    {
      name: "急性気管支炎",
      date: "2025/11/05",
      condition: "発熱、咳嗽を主訴とし、胸部X線で肺炎像を認めない患者",
      department: "呼吸器内科",
      doctor: "山本 美咲",
      status: "治癒",
    },
    {
      name: "脂質異常症",
      date: "2023/09/10",
      condition: "LDL-C >= 140mg/dL または TG >= 150mg/dL の患者",
      department: "内科",
      doctor: "田中 太郎",
      status: "治療中",
    },
  ];

  // -------------------------
  // アレルギーテーブル定義
  // -------------------------
  const allergyGroups: ColumnGroup[] = [
    { label: "アレルゲン情報", colSpan: 2 },
    { label: "症状・確認", colSpan: 3 },
  ];

  const allergyColumns: Column[] = [
    { key: "allergen", label: "アレルゲン" },
    { key: "category", label: "分類" },
    { key: "severity", label: "重症度" },
    { key: "symptom", label: "症状" },
    { key: "date", label: "確認日" },
  ];

  const allergyData: RowData[] = [
    {
      allergen: "ペニシリン",
      category: "薬剤",
      severity: "重度",
      symptom: "アナフィラキシー",
      date: "2020/05/12",
    },
    {
      allergen: "スギ花粉",
      category: "環境",
      severity: "中度",
      symptom: "鼻炎・結膜炎",
      date: "2019/03/20",
    },
    {
      allergen: "エビ",
      category: "食物",
      severity: "軽度",
      symptom: "蕁麻疹",
      date: "2022/08/15",
    },
  ];

  // -------------------------
  // 検査テーブル定義
  // -------------------------
  const examGroups: ColumnGroup[] = [
    { label: "検査情報", colSpan: 2 },
    { label: "結果詳細", colSpan: 3 },
  ];

  const examColumns: Column[] = [
    { key: "name", label: "検査名" },
    { key: "date", label: "実施日" },
    { key: "result", label: "結果" },
    { key: "reference", label: "基準値" },
    { key: "judgment", label: "判定" },
  ];

  const examData: RowData[] = [
    {
      name: "HbA1c",
      date: "2026/06/01",
      result: "6.8%",
      reference: "4.6〜6.2%",
      judgment: "高値",
    },
    {
      name: "血圧測定",
      date: "2026/06/01",
      result: "138/88 mmHg",
      reference: "130/85 mmHg未満",
      judgment: "やや高値",
    },
    {
      name: "総コレステロール",
      date: "2026/05/15",
      result: "210 mg/dL",
      reference: "150〜219 mg/dL",
      judgment: "正常",
    },
    {
      name: "胸部X線",
      date: "2026/04/10",
      result: "異常なし",
      reference: "—",
      judgment: "正常",
    },
  ];

  return (
    <>
      <section className="mb-12" id="tab-section">
        <h3
          className="text-xl font-bold text-gray-900 mb-1"
          id="medical-info-heading"
        >
          医療情報
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          タブで情報を切り替えて表示するパターン
        </p>
        <Tab
          headingId="medical-info-heading"
          items={[
            {
              label: "傷病",
              id: "tab-disease",
              content: (
                <SortableTable
                  groups={diseaseGroups}
                  columns={diseaseColumns}
                  data={diseaseData}
                />
              ),
            },
            {
              label: "アレルギー",
              id: "tab-allergy",
              content: (
                <SortableTable
                  groups={allergyGroups}
                  columns={allergyColumns}
                  data={allergyData}
                />
              ),
            },
            {
              label: "検査",
              id: "tab-examination",
              content: (
                <SortableTable
                  groups={examGroups}
                  columns={examColumns}
                  data={examData}
                />
              ),
            },
          ]}
        />
      </section>

      {/* 抽出条件表示用のモーダル */}
      <ModalDialog ref={dialogRef} aria-labelledby="condition-modal-title">
        <ModalDialogContent>
          <ModalDialogHeader>
            <ModalDialogHeading id="condition-modal-title">
              タイトル
            </ModalDialogHeading>
          </ModalDialogHeader>
          <ModalDialogBody>
            <React.Fragment key=".0">
              {selectedCondition || "条件が設定されていません"}
            </React.Fragment>
          </ModalDialogBody>
          <ModalDialogActions className="flex justify-end">
            <Button onClick={handleCloseModal} size="lg" variant="solid-fill">
              OK
            </Button>
          </ModalDialogActions>
        </ModalDialogContent>
      </ModalDialog>
    </>
  );
}
