import SortableTable from "../components/SortableTable";
import type { Column, RowData, ColumnGroup } from "../components/SortableTable";
import Tab from "../components/Tab";
import Link from "next/link";

/**
 * 抽出状況参照画面
 *
 * データソースからの抽出処理状況をタブ＋テーブル形式で表示する。
 */

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
  { name: "2型糖尿病", date: "2024/03/15", department: "内科", doctor: "田中 太郎", status: "治療中" },
  { name: "高血圧症", date: "2023/08/22", department: "循環器内科", doctor: "鈴木 花子", status: "治療中" },
  { name: "腰椎椎間板ヘルニア", date: "2025/01/10", department: "整形外科", doctor: "佐藤 健一", status: "経過観察" },
  { name: "急性気管支炎", date: "2025/11/05", department: "呼吸器内科", doctor: "山本 美咲", status: "治癒" },
  { name: "脂質異常症", date: "2023/09/10", department: "内科", doctor: "田中 太郎", status: "治療中" },
  { name: "白内障", date: "2024/05/20", department: "眼科", doctor: "小林 隆", status: "手術予定" },
  { name: "変形性膝関節症", date: "2022/11/12", department: "整形外科", doctor: "佐藤 健一", status: "治療中" },
  { name: "逆流性食道炎", date: "2025/02/18", department: "消化器内科", doctor: "伊藤 恵", status: "経過観察" },
  { name: "睡眠時無呼吸症候群", date: "2024/07/03", department: "呼吸器内科", doctor: "山本 美咲", status: "治療中" },
  { name: "慢性胃炎", date: "2023/12/01", department: "消化器内科", doctor: "伊藤 恵", status: "経過観察" },
  { name: "アレルギー性鼻炎", date: "2021/04/15", department: "耳鼻咽喉科", doctor: "加藤 健太", status: "治療中" },
  { name: "痛風", date: "2024/10/08", department: "内科", doctor: "田中 太郎", status: "経過観察" },
  { name: "メニエール病", date: "2025/08/22", department: "耳鼻咽喉科", doctor: "加藤 健太", status: "治癒" },
  { name: "手根管症候群", date: "2026/01/30", department: "整形外科", doctor: "佐藤 健一", status: "経過観察" },
];

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
  { allergen: "ペニシリン", category: "薬剤", severity: "重度", symptom: "アナフィラキシー", date: "2020/05/12" },
  { allergen: "スギ花粉", category: "環境", severity: "中度", symptom: "鼻炎・結膜炎", date: "2019/03/20" },
  { allergen: "エビ", category: "食物", severity: "軽度", symptom: "蕁麻疹", date: "2022/08/15" },
];

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
  { name: "HbA1c", date: "2026/06/01", result: "6.8%", reference: "4.6〜6.2%", judgment: "高値" },
  { name: "血圧測定", date: "2026/06/01", result: "138/88 mmHg", reference: "130/85 mmHg未満", judgment: "やや高値" },
  { name: "総コレステロール", date: "2026/05/15", result: "210 mg/dL", reference: "150〜219 mg/dL", judgment: "正常" },
  { name: "胸部X線", date: "2026/04/10", result: "異常なし", reference: "—", judgment: "正常" },
  { name: "尿検査", date: "2026/06/01", result: "蛋白(−)、糖(−)", reference: "(−)", judgment: "正常" },
];

export default function ExtractionStatusPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <header className="portal-header" id="portal-header">
        <div className="portal-header__inner">
          <div className="portal-header__logo">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="18" fill="#0017C1" />
              <path
                d="M18 7C11.925 7 7 11.925 7 18s4.925 11 11 11 11-4.925 11-11S24.075 7 18 7zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                fill="white"
              />
              <circle cx="18" cy="18" r="3.5" fill="white" />
            </svg>
            <div>
              <h1 className="portal-header__title">データマネジメントポータル</h1>
              <p className="portal-header__subtitle">Data Management Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ（薄い青背景） */}
      <main className="page-bg flex-1">
        <div className="page-container">
          {/* 白いコンテンツコンテナ */}
          <div className="content-card">


            {/* ページタイトル */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                抽出状況参照
              </h2>
              <p className="text-std-16N-170 text-gray-600">
                データソースからの抽出処理の実行状況を確認できます。
              </p>
            </div>

            {/* タブ＋テーブル */}
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
                    content: <SortableTable groups={diseaseGroups} columns={diseaseColumns} data={diseaseData} />,
                  },
                  {
                    label: "アレルギー",
                    id: "tab-allergy",
                    content: <SortableTable groups={allergyGroups} columns={allergyColumns} data={allergyData} />,
                  },
                  {
                    label: "検査",
                    id: "tab-examination",
                    content: <SortableTable groups={examGroups} columns={examColumns} data={examData} />,
                  },
                ]}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
