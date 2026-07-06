import { cookies } from "next/headers";
import Link from "next/link";
import Header from "../../../components/layout/Header";
import LinkCard from "../../../components/ui/LinkCard";
import MetadataViewTabs from "../_components/MetadataViewTabs";
import MetadataEdit from "../_components/MetadataEdit";
import { NotificationBanner } from "../../../components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "../../../components/layout/NotificationBanner/parts/Body";

/** データ種別の表示名マッピング */
const typeLabels: Record<string, string> = {
  clinical: "臨床情報",
  document: "文書情報",
  attachment: "添付情報",
  "health-check": "健診文書",
  prescription: "処方情報",
};

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MetadataTypePage({ params, searchParams }: Props) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  const { type } = await params;
  const query = await searchParams;
  const tabParam = typeof query.tab === "string" ? query.tab : "overview";
  const isEditMode = query.mode === "edit";
  const isSuccess = query.success === "true";

  const typeLabel = typeLabels[type] || type;

  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

  if (isEditMode) {
    return <MetadataEdit userId={userId} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      <main className="page-bg flex-1">
        {isSuccess && (
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type="success"
              title="ビジネスメタデータを更新しました"
            >
              <NotificationBannerBody>
                入力された情報が正しく保存されました。
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        )}

        <div className="page-container">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              メタデータ
            </h2>
            <Link
              href={`/metadata/${type}?mode=edit&tab=${tabParam}`}
              className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-white border-2 border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-[2px] focus-visible:ring-yellow-300"
            >
              編集
            </Link>
          </div>

          <div className="mb-12">
            <MetadataViewTabs
              headingId="metadata-tabs-heading"
              defaultIndex={defaultIndex}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                      <LinkCard
                        href={`/metadata/table-def?tab=disease&from=${type}`}
                        title="傷病"
                      />
                      <LinkCard
                        href={`/metadata/table-def?tab=allergy&from=${type}`}
                        title="アレルギー"
                      />
                      <LinkCard
                        href={`/metadata/table-def?tab=examination&from=${type}`}
                        title="検査"
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="mt-8">
            <Link
              href="/metadata"
              className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
            >
              戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="space-y-10 py-6 text-gray-900">
      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
          概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
        </p>
      </section>

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

      <section>
        <h3 className="text-xl font-bold mb-4">更新頻度</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left font-bold text-gray-900 border-r border-gray-300 w-1/2">
                  対象項目
                </th>
                <th className="py-3 px-4 text-left font-bold text-gray-900 w-1/2">
                  頻度
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 border-r border-gray-200">
                  項目名
                </td>
                <td className="py-3 px-4 text-gray-700">年次</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 border-r border-gray-200">
                  項目名
                </td>
                <td className="py-3 px-4 text-gray-700">年次</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg text-gray-600 font-bold mb-3 border-l-4 border-gray-400 pl-3">
              〇〇テーブル
            </h4>
            <div className="space-y-4 text-sm ml-4">
              <div>
                <h5 className="font-bold mb-1">概要</h5>
                <p className="text-gray-700 leading-relaxed">
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明
                </p>
              </div>
              <div>
                <h5 className="font-bold mb-1">格納単位</h5>
                <p className="text-gray-700">レセプト</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg text-gray-600 font-bold mb-3 border-l-4 border-gray-400 pl-3">
              〇〇テーブル
            </h4>
            <div className="space-y-4 text-sm ml-4">
              <div>
                <h5 className="font-bold mb-1">概要</h5>
                <p className="text-gray-700 leading-relaxed">
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
                  概要の説明 概要の説明 概要の説明 概要の説明
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

      <section>
        <h3 className="text-xl font-bold mb-4">留意事項</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項 留意事項 留意事項 留意事項 留意事項
          留意事項 留意事項 留意事項
        </p>
      </section>
    </div>
  );
}
