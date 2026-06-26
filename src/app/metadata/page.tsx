import Link from "next/link";
import Tab from "../components/Tab";

/**
 * メタデータ参照画面
 *
 * 各種データ種別ごとのメタデータ（概要、ER図、テーブル定義など）を参照する画面。
 */
export default function MetadataPage() {
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                メタデータ参照
              </h2>
            </div>

            {/* 青い下線（区切り） */}
            <hr className="border-t-[3px] border-[#0017C1] mb-8" />

            {/* データ種別選択 */}
            <div className="mb-8">
              <label htmlFor="dataType" className="block text-sm font-bold text-gray-900 mb-2">
                データ種別
              </label>
              <span className="relative inline-block w-64">
                <select
                  id="dataType"
                  className="block w-full h-14 appearance-none border border-gray-400 rounded-[8px] bg-white pl-4 pr-10 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300"
                  defaultValue="clinical"
                >
                  <option value="clinical">臨床情報</option>
                  <option value="claim">レセプト情報</option>
                  <option value="health_check">健診情報</option>
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
                  fill="none"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                >
                  <path
                    d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>

            {/* タブ領域 */}
            <div className="mb-12">
              <Tab
                headingId="metadata-tabs-heading"
                items={[
                  {
                    label: "概要",
                    id: "tab-overview",
                    content: <OverviewContent />,
                  },
                  {
                    label: "ER図",
                    id: "tab-er",
                    content: (
                      <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        ER図が表示されます
                      </div>
                    ),
                  },
                  {
                    label: "テーブル定義",
                    id: "tab-table-def",
                    content: (
                      <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        テーブル定義が表示されます
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* 戻るボタン */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
              >
                戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * 「概要」タブの中身のコンポーネント
 */
function OverviewContent() {
  return (
    <div className="space-y-10 py-6 text-gray-900">
      {/* 概要 */}
      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
        </p>
      </section>

      {/* 収集期間 */}
      <section>
        <h3 className="text-xl font-bold mb-4">収集期間</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold mb-1">収集開始年度</h4>
            <p className="text-gray-700">2020年</p>
          </div>
          <div>
            <h4 className="font-bold mb-1">最新の提供可能年度</h4>
            <p className="text-gray-700">2026年</p>
          </div>
        </div>
      </section>

      {/* 更新頻度 */}
      <section>
        <h3 className="text-xl font-bold mb-4">更新頻度</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left font-bold text-gray-900 border-r border-gray-300 w-1/2">対象項目</th>
                <th className="py-3 px-4 text-left font-bold text-gray-900 w-1/2">頻度</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 border-r border-gray-200">項目名</td>
                <td className="py-3 px-4 text-gray-700">年次</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 border-r border-gray-200">項目名</td>
                <td className="py-3 px-4 text-gray-700">年次</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* テーブル一覧 */}
      <section>
        <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
        <div className="space-y-8">
          {/* テーブルアイテム 1 */}
          <div>
            <h4 className="text-lg text-gray-600 font-bold mb-3 border-l-4 border-gray-400 pl-3">〇〇テーブル</h4>
            <div className="space-y-4 text-sm ml-4">
              <div>
                <h5 className="font-bold mb-1">概要</h5>
                <p className="text-gray-700 leading-relaxed">
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                </p>
              </div>
              <div>
                <h5 className="font-bold mb-1">格納単位</h5>
                <p className="text-gray-700">レセプト</p>
              </div>
            </div>
          </div>

          {/* テーブルアイテム 2 */}
          <div>
            <h4 className="text-lg text-gray-600 font-bold mb-3 border-l-4 border-gray-400 pl-3">〇〇テーブル</h4>
            <div className="space-y-4 text-sm ml-4">
              <div>
                <h5 className="font-bold mb-1">概要</h5>
                <p className="text-gray-700 leading-relaxed">
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                </p>
              </div>
              <div>
                <h5 className="font-bold mb-1">格納単位</h5>
                <p className="text-gray-700">レセプト</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 留意事項 */}
      <section>
        <h3 className="text-xl font-bold mb-4">留意事項</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
        </p>
      </section>
    </div>
  );
}
