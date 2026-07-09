import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import { fetchExtractionStatus } from "./api";
import ExtractionStatusContent from "./ExtractionStatusContent";

// Pageコンポーネントは searchParams を非同期で受け取ることができます (Next.js 15)
export default async function ExtractionStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  // URLのクエリパラメータから検索条件を取得
  const resolvedSearchParams = await searchParams;
  const year =
    typeof resolvedSearchParams.year === "string"
      ? resolvedSearchParams.year
      : undefined;
  const month =
    typeof resolvedSearchParams.month === "string"
      ? resolvedSearchParams.month
      : undefined;

  // サーバー側で検索条件を元にデータを取得
  const data = await fetchExtractionStatus({ year, month });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      <main className="page-bg flex-1">
        <div className="page-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              抽出状況参照
            </h2>
          </div>

          <ExtractionStatusContent
            data={data}
            initialYear={year}
            initialMonth={month}
          />
        </div>
      </main>
    </div>
  );
}
