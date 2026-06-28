"use client";

import React from "react";
import SortableTable from "../../components/ui/SortableTable";
import type { Column, RowData, ColumnGroup } from "../../components/ui/SortableTable";
import Tab from "../../components/ui/Tab";

export default function DataProfileContent() {
  // -------------------------
  // 傷病テーブル定義
  // -------------------------
  const diseaseGroups: ColumnGroup[] = [
    { label: "基本情報", colSpan: 2 },
    { label: "診療情報", colSpan: 3 },
  ];

  const diseaseColumns: Column[] = [
    { key: "name", label: "傷病名" },
    { key: "date", label: "診断日" },
    { key: "department", label: "診療科" },
    { key: "doctor", label: "主治医" },
    { key: "status", label: "状態" },
  ];

  const diseaseData: RowData[] = [
    {
      name: "2型糖尿病",
      date: "2024-03-15",
      department: "内科",
      doctor: "田中 太郎",
      status: "治療中",
    },
    {
      name: "高血圧症",
      date: "2023-08-22",
      department: "循環器内科",
      doctor: "鈴木 花子",
      status: "治療中",
    },
    {
      name: "腰椎椎間板ヘルニア",
      date: "2025-01-10",
      department: "整形外科",
      doctor: "佐藤 健一",
      status: "経過観察",
    },
    {
      name: "急性気管支炎",
      date: "2025-11-05",
      department: "呼吸器内科",
      doctor: "山本 美咲",
      status: "治癒",
    },
    {
      name: "脂質異常症",
      date: "2023-09-10",
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
      date: "2024-03-15",
    },
    {
      allergen: "スギ花粉",
      category: "環境",
      severity: "中度",
      symptom: "鼻炎・結膜炎",
      date: "2023-08-22",
    },
    {
      allergen: "エビ",
      category: "食物",
      severity: "軽度",
      symptom: "蕁麻疹",
      date: "2025-01-10",
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
      date: "2025-11-05",
      result: "6.8%",
      reference: "4.6〜6.2%",
      judgment: "高値",
    },
    {
      name: "血圧測定",
      date: "2023-09-10",
      result: "138/88 mmHg",
      reference: "130/85 mmHg未満",
      judgment: "やや高値",
    },
    {
      name: "総コレステロール",
      date: "2024-03-15",
      result: "210 mg/dL",
      reference: "150〜219 mg/dL",
      judgment: "正常",
    },
    {
      name: "胸部X線",
      date: "2023-08-22",
      result: "異常なし",
      reference: "—",
      judgment: "正常",
    },
  ];

  return (
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
  );
}
