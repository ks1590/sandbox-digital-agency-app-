import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import { fetchDataProfile } from "./api";
import DataProfileContent from "./DataProfileContent";

export default async function DataProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  // サーバー側（Lambda）でGoのAPIを叩いてデータを取得します。
  // ここで取得するため、ブラウザ側でのCORSは発生しません。
  const data = await fetchDataProfile();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      <main className="page-bg flex-1">
        <div className="page-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              データプロファイル参照
            </h2>
          </div>

          <DataProfileContent data={data} />
        </div>
      </main>
    </div>
  );
}
