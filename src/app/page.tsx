import Header from "@/components/layout/Header";
import LinkCard from "@/components/ui/LinkCard";

export default async function PortalPage() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="portal-main" id="mainContainer">
        <section className="portal-cards-section" id="portal-cards">
          <div className="portal-cards-section__inner">
            <div className="portal-cards-section__header">
              <h2 className="portal-cards-section__title">メニュー</h2>
            </div>

            <div className="portal-cards-stack">
              <LinkCard title="抽出状況検索" href="/extraction-status" />
              <LinkCard title="メタデータ参照・登録" href="/metadata" />
              <LinkCard title="データプロファイル参照" href="/data-profile" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
