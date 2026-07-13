import Header from "@/components/layout/Header";
import ExtractionStatusContent from "./ExtractionStatusContent";

export default function ExtractionStatusPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="page-bg flex-1">
        <div className="page-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              抽出状況検索
            </h2>
          </div>

          <ExtractionStatusContent />
        </div>
      </main>
    </div>
  );
}
