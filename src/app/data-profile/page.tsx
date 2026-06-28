import { cookies } from "next/headers";
import Header from "../components/Header";
import DataProfileContent from "./DataProfileContent";

/**
 * データプロファイル参照画面
 */
export default async function DataProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <Header userId={userId} />

      {/* メインコンテンツ（薄い青背景） */}
      <main className="page-bg flex-1">
        <div className="page-container">
          {/* ページタイトル */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              データプロファイル参照
            </h2>
            <p className="text-std-16N-170 text-gray-600">
              各テーブルのデータプロファイル（概要・品質指標など）を参照できます。
            </p>
          </div>

          <DataProfileContent />
        </div>
      </main>
    </div>
  );
}
