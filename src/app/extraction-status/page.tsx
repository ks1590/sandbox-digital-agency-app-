import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import ExtractionStatusContent from "./ExtractionStatusContent";

export default async function ExtractionStatusPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

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

          <ExtractionStatusContent />
        </div>
      </main>
    </div>
  );
}
