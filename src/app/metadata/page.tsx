import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { NotificationBanner } from "@/components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "@/components/layout/NotificationBanner/parts/Body";
import MetadataEdit from "./_components/edit/MetadataEdit";
import MetadataContent from "./_components/view/MetadataContent";
import { fetchMetadata } from "./api";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MetadataPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  const params = await searchParams;
  const isEditMode = params.mode === "edit";
  const isSuccess = params.success === "true";

  const data = await fetchMetadata();

  if (isEditMode) {
    return <MetadataEdit userId={userId} data={data} />;
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

          <MetadataContent data={data} />
        </div>
      </main>
    </div>
  );
}
