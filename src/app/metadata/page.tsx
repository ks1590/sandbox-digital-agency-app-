import { cookies } from "next/headers";
import Link from "next/link";
import Header from "../../components/layout/Header";
import { NotificationBanner } from "../../components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "../../components/layout/NotificationBanner/parts/Body";
import LinkCard from "../../components/ui/LinkCard";
import MetadataEdit from "./_components/MetadataEdit";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MetadataPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  const params = await searchParams;
  const isEditMode = params.mode === "edit";
  const isSuccess = params.success === "true";

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
            <h2 className="text-2xl font-bold text-gray-900">メタデータ</h2>
            <Link
              href="/metadata?mode=edit"
              className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-[#0017C1] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-[#1A30C9] focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              編集
            </Link>
          </div>

          {/* 概要セクション */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">概要</h3>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
              概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
              概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
              概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
              概要の説明 概要の説明 概要の説明 概要の説明 概要の説明 概要の説明
              概要の説明 概要の説明 概要の説明 概要の説明
            </p>
          </section>

          {/* データ種別セクション */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">データ種別</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <LinkCard href="/metadata/clinical" title="臨床情報" />
              {/* <LinkCard href="/metadata/document" title="文書情報" />
              <LinkCard href="/metadata/attachment" title="添付情報" />
              <LinkCard href="/metadata/health-check" title="健診文書" />
              <LinkCard href="/metadata/prescription" title="処方情報" /> */}
            </div>
          </section>

          {/* キー情報セクション */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">キー情報</h3>
            <div className="p-6 border border-gray-300 rounded-lg bg-white min-h-[120px]">
              <p className="text-sm text-gray-500 text-center">キー情報</p>
            </div>
          </section>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
