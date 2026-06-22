import SortableTable from "./components/SortableTable";
import Tab from "./components/Tab";
import type { TabItem } from "./components/Tab";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b-2 border-blue-900 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="16" fill="#0017C1" />
              <path
                d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                fill="white"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">
              デジタル庁デザインシステム サンプル
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            テーブルコンポーネント
          </h2>
          <p className="text-std-16N-170 text-gray-600">
            デジタル庁デザインシステムに準拠したテーブルの実装例です。
          </p>
        </div>

        {/* タブコンポーネント */}
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
                  <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
                    <table className="w-full text-std-16N-170">
                      <thead>
                        <tr className="border-b border-black bg-solid-gray-100">
                          <th className="px-4 py-5 text-start align-top" scope="col">傷病名</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">診断日</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">診療科</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">主治医</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">状態</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">2型糖尿病</td>
                          <td className="px-4 py-5 align-top">2024/03/15</td>
                          <td className="px-4 py-5 align-top">内科</td>
                          <td className="px-4 py-5 align-top">田中 太郎</td>
                          <td className="px-4 py-5 align-top">治療中</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">高血圧症</td>
                          <td className="px-4 py-5 align-top">2023/08/22</td>
                          <td className="px-4 py-5 align-top">循環器内科</td>
                          <td className="px-4 py-5 align-top">鈴木 花子</td>
                          <td className="px-4 py-5 align-top">治療中</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">腰椎椎間板ヘルニア</td>
                          <td className="px-4 py-5 align-top">2025/01/10</td>
                          <td className="px-4 py-5 align-top">整形外科</td>
                          <td className="px-4 py-5 align-top">佐藤 健一</td>
                          <td className="px-4 py-5 align-top">経過観察</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">急性気管支炎</td>
                          <td className="px-4 py-5 align-top">2025/11/05</td>
                          <td className="px-4 py-5 align-top">呼吸器内科</td>
                          <td className="px-4 py-5 align-top">山本 美咲</td>
                          <td className="px-4 py-5 align-top">治癒</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
              {
                label: "アレルギー",
                id: "tab-allergy",
                content: (
                  <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
                    <table className="w-full text-std-16N-170">
                      <thead>
                        <tr className="border-b border-black bg-solid-gray-100">
                          <th className="px-4 py-5 text-start align-top" scope="col">アレルゲン</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">分類</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">重症度</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">症状</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">確認日</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">ペニシリン</td>
                          <td className="px-4 py-5 align-top">薬剤</td>
                          <td className="px-4 py-5 align-top">重度</td>
                          <td className="px-4 py-5 align-top">アナフィラキシー</td>
                          <td className="px-4 py-5 align-top">2020/05/12</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">スギ花粉</td>
                          <td className="px-4 py-5 align-top">環境</td>
                          <td className="px-4 py-5 align-top">中度</td>
                          <td className="px-4 py-5 align-top">鼻炎・結膜炎</td>
                          <td className="px-4 py-5 align-top">2019/03/20</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">エビ</td>
                          <td className="px-4 py-5 align-top">食物</td>
                          <td className="px-4 py-5 align-top">軽度</td>
                          <td className="px-4 py-5 align-top">蕁麻疹</td>
                          <td className="px-4 py-5 align-top">2022/08/15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
              {
                label: "検査",
                id: "tab-examination",
                content: (
                  <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
                    <table className="w-full text-std-16N-170">
                      <thead>
                        <tr className="border-b border-black bg-solid-gray-100">
                          <th className="px-4 py-5 text-start align-top" scope="col">検査名</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">実施日</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">結果</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">基準値</th>
                          <th className="px-4 py-5 text-start align-top" scope="col">判定</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">HbA1c</td>
                          <td className="px-4 py-5 align-top">2026/06/01</td>
                          <td className="px-4 py-5 align-top">6.8%</td>
                          <td className="px-4 py-5 align-top">4.6〜6.2%</td>
                          <td className="px-4 py-5 align-top">高値</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">血圧測定</td>
                          <td className="px-4 py-5 align-top">2026/06/01</td>
                          <td className="px-4 py-5 align-top">138/88 mmHg</td>
                          <td className="px-4 py-5 align-top">130/85 mmHg未満</td>
                          <td className="px-4 py-5 align-top">やや高値</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">総コレステロール</td>
                          <td className="px-4 py-5 align-top">2026/05/15</td>
                          <td className="px-4 py-5 align-top">210 mg/dL</td>
                          <td className="px-4 py-5 align-top">150〜219 mg/dL</td>
                          <td className="px-4 py-5 align-top">正常</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">胸部X線</td>
                          <td className="px-4 py-5 align-top">2026/04/10</td>
                          <td className="px-4 py-5 align-top">異常なし</td>
                          <td className="px-4 py-5 align-top">—</td>
                          <td className="px-4 py-5 align-top">正常</td>
                        </tr>
                        <tr className="border-b border-solid-gray-420">
                          <td className="px-4 py-5 align-top">尿検査</td>
                          <td className="px-4 py-5 align-top">2026/06/01</td>
                          <td className="px-4 py-5 align-top">蛋白(−)、糖(−)</td>
                          <td className="px-4 py-5 align-top">(−)</td>
                          <td className="px-4 py-5 align-top">正常</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
            ] satisfies TabItem[]}
          />
        </section>

        {/* セクション1: 基本テーブル（1行目が見出しセル） */}
        <section className="mb-12" id="basic-table">
          <h3 className="text-xl font-bold text-gray-900 mb-1">基本テーブル</h3>
          <p className="text-sm text-gray-500 mb-4">
            1行目が見出しセル（th）のパターン
          </p>
          <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
            <table className="w-full text-std-16N-170">
              <thead>
                <tr className="border-b border-black bg-solid-gray-100">
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    手続き名
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    担当府省庁
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    対象者
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    申請方法
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    処理日数
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    状態
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-solid-gray-420">
                  <td className="px-4 py-5 align-top">転入届</td>
                  <td className="px-4 py-5 align-top">総務省</td>
                  <td className="px-4 py-5 align-top">引越しをした方</td>
                  <td className="px-4 py-5 align-top">窓口・オンライン</td>
                  <td className="px-4 py-5 align-top">即日</td>
                  <td className="px-4 py-5 align-top">受付中</td>
                </tr>
                <tr className="border-b border-solid-gray-420">
                  <td className="px-4 py-5 align-top">
                    マイナンバーカード申請
                  </td>
                  <td className="px-4 py-5 align-top">デジタル庁</td>
                  <td className="px-4 py-5 align-top">全国民</td>
                  <td className="px-4 py-5 align-top">
                    窓口・オンライン・郵送
                  </td>
                  <td className="px-4 py-5 align-top">約1ヶ月</td>
                  <td className="px-4 py-5 align-top">受付中</td>
                </tr>
                <tr className="border-b border-solid-gray-420">
                  <td className="px-4 py-5 align-top">児童手当の申請</td>
                  <td className="px-4 py-5 align-top">
                    こども家庭庁
                  </td>
                  <td className="px-4 py-5 align-top">
                    中学生以下の児童を養育する方
                  </td>
                  <td className="px-4 py-5 align-top">窓口・オンライン</td>
                  <td className="px-4 py-5 align-top">約2週間</td>
                  <td className="px-4 py-5 align-top">受付中</td>
                </tr>
                <tr className="border-b border-solid-gray-420">
                  <td className="px-4 py-5 align-top">パスポート申請</td>
                  <td className="px-4 py-5 align-top">外務省</td>
                  <td className="px-4 py-5 align-top">日本国民</td>
                  <td className="px-4 py-5 align-top">窓口</td>
                  <td className="px-4 py-5 align-top">約1週間</td>
                  <td className="px-4 py-5 align-top">受付中</td>
                </tr>
                <tr className="border-b border-solid-gray-420">
                  <td className="px-4 py-5 align-top">確定申告</td>
                  <td className="px-4 py-5 align-top">国税庁</td>
                  <td className="px-4 py-5 align-top">
                    個人事業主・一定の給与所得者等
                  </td>
                  <td className="px-4 py-5 align-top">オンライン・郵送・窓口</td>
                  <td className="px-4 py-5 align-top">申告期間内</td>
                  <td className="px-4 py-5 align-top">期間外</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* セクション2: ストライプテーブル */}
        <section className="mb-12" id="stripe-table">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            ストライプテーブル
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            偶数行に背景色を適用して視認性を向上させたパターン
          </p>
          <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
            <table className="w-full text-std-16N-170">
              <thead>
                <tr className="border-b border-black bg-solid-gray-100">
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    システム名
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    管理部署
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    稼働状況
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    最終更新日
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    利用者数
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    バージョン
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">
                    マイナポータル
                  </td>
                  <td className="px-4 py-5 align-top">デジタル庁</td>
                  <td className="px-4 py-5 align-top">稼働中</td>
                  <td className="px-4 py-5 align-top">2026/06/15</td>
                  <td className="px-4 py-5 align-top">45,230,000</td>
                  <td className="px-4 py-5 align-top">v3.2.1</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">e-Tax</td>
                  <td className="px-4 py-5 align-top">国税庁</td>
                  <td className="px-4 py-5 align-top">稼働中</td>
                  <td className="px-4 py-5 align-top">2026/06/10</td>
                  <td className="px-4 py-5 align-top">32,150,000</td>
                  <td className="px-4 py-5 align-top">v8.1.0</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">eLTAX</td>
                  <td className="px-4 py-5 align-top">総務省</td>
                  <td className="px-4 py-5 align-top">稼働中</td>
                  <td className="px-4 py-5 align-top">2026/05/28</td>
                  <td className="px-4 py-5 align-top">18,400,000</td>
                  <td className="px-4 py-5 align-top">v5.0.3</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">
                    登記情報提供サービス
                  </td>
                  <td className="px-4 py-5 align-top">法務省</td>
                  <td className="px-4 py-5 align-top">メンテナンス中</td>
                  <td className="px-4 py-5 align-top">2026/06/01</td>
                  <td className="px-4 py-5 align-top">8,920,000</td>
                  <td className="px-4 py-5 align-top">v2.4.7</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">
                    e-Gov電子申請
                  </td>
                  <td className="px-4 py-5 align-top">デジタル庁</td>
                  <td className="px-4 py-5 align-top">稼働中</td>
                  <td className="px-4 py-5 align-top">2026/06/18</td>
                  <td className="px-4 py-5 align-top">25,600,000</td>
                  <td className="px-4 py-5 align-top">v6.3.2</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50">
                  <td className="px-4 py-5 align-top">
                    GビズID
                  </td>
                  <td className="px-4 py-5 align-top">デジタル庁</td>
                  <td className="px-4 py-5 align-top">稼働中</td>
                  <td className="px-4 py-5 align-top">2026/06/12</td>
                  <td className="px-4 py-5 align-top">4,580,000</td>
                  <td className="px-4 py-5 align-top">v4.1.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* セクション3: ホバーハイライトテーブル */}
        <section className="mb-12" id="hover-table">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            ホバーハイライトテーブル
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            マウスオーバーで行をハイライト表示するインタラクティブなパターン
          </p>
          <div className="overflow-x-auto rounded-lg border border-solid-gray-420">
            <table className="w-full text-std-16N-170">
              <thead>
                <tr className="border-b border-black bg-solid-gray-100">
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    会議名
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    開催日
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    開催場所
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    議題
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    参加人数
                  </th>
                  <th className="px-4 py-5 text-start align-top" scope="col">
                    資料
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    デジタル社会推進会議
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/20</td>
                  <td className="px-4 py-5 align-top">中央合同庁舎第7号館</td>
                  <td className="px-4 py-5 align-top">
                    デジタル基盤の整備について
                  </td>
                  <td className="px-4 py-5 align-top">32名</td>
                  <td className="px-4 py-5 align-top">公開済み</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    データ戦略推進ワーキンググループ
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/18</td>
                  <td className="px-4 py-5 align-top">オンライン</td>
                  <td className="px-4 py-5 align-top">
                    オープンデータの利活用促進
                  </td>
                  <td className="px-4 py-5 align-top">18名</td>
                  <td className="px-4 py-5 align-top">公開済み</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    マイナンバー制度推進検討会
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/15</td>
                  <td className="px-4 py-5 align-top">中央合同庁舎第2号館</td>
                  <td className="px-4 py-5 align-top">
                    マイナンバーカードの利活用拡大
                  </td>
                  <td className="px-4 py-5 align-top">25名</td>
                  <td className="px-4 py-5 align-top">準備中</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    ガバメントクラウド検討会
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/12</td>
                  <td className="px-4 py-5 align-top">オンライン</td>
                  <td className="px-4 py-5 align-top">
                    クラウド移行の進捗報告
                  </td>
                  <td className="px-4 py-5 align-top">40名</td>
                  <td className="px-4 py-5 align-top">公開済み</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    UI/UXデザイン標準化委員会
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/10</td>
                  <td className="px-4 py-5 align-top">中央合同庁舎第7号館</td>
                  <td className="px-4 py-5 align-top">
                    デザインシステムの更新方針
                  </td>
                  <td className="px-4 py-5 align-top">15名</td>
                  <td className="px-4 py-5 align-top">公開済み</td>
                </tr>
                <tr className="border-b border-solid-gray-500 even:bg-solid-gray-50 hover:bg-key-50 transition-colors">
                  <td className="px-4 py-5 align-top">
                    自治体DX推進会議
                  </td>
                  <td className="px-4 py-5 align-top">2026/06/08</td>
                  <td className="px-4 py-5 align-top">オンライン</td>
                  <td className="px-4 py-5 align-top">
                    自治体システム標準化の取組状況
                  </td>
                  <td className="px-4 py-5 align-top">55名</td>
                  <td className="px-4 py-5 align-top">公開済み</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* セクション4: ソート可能テーブル */}
        <section className="mb-12" id="sortable-table">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            ソート可能テーブル
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            ヘッダーをクリックしてデータをソートできるインタラクティブなパターン
          </p>
          <SortableTable />
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-solid-gray-420 bg-solid-gray-50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            デジタル庁デザインシステム サンプルアプリケーション
          </p>
        </div>
      </footer>
    </div>
  );
}
