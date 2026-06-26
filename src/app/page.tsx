import LinkCard from "./components/LinkCard";

/**
 * ポータルTOP画面
 *
 * データマネジメントシステムのメインエントリーポイント。
 * 3つの主要機能画面へのリンクカードを提供する。
 */
export default function PortalPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <header className="portal-header" id="portal-header">
        <div className="portal-header__inner">
          <div className="portal-header__logo">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="18" fill="#0017C1" />
              <path
                d="M18 7C11.925 7 7 11.925 7 18s4.925 11 11 11 11-4.925 11-11S24.075 7 18 7zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                fill="white"
              />
              <circle cx="18" cy="18" r="3.5" fill="white" />
            </svg>
            <div>
              <h1 className="portal-header__title">データマネジメントポータル</h1>
              <p className="portal-header__subtitle">Data Management Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="portal-main" id="mainContainer">
        {/* ヒーローセクション */}
        <section className="portal-hero" id="portal-hero">
          <div className="portal-hero__inner">
            <div className="portal-hero__content">
              <h2 className="portal-hero__heading">
                データの品質を、<br className="hidden sm:inline" />
                可視化・管理する
              </h2>
              <p className="portal-hero__text">
                データの抽出状況の確認、メタデータの参照、データプロファイルの分析を
                一元的に行えるポータルサイトです。
              </p>
            </div>
          </div>
        </section>

        {/* リンクカードセクション */}
        <section className="portal-cards-section" id="portal-cards">
          <div className="portal-cards-section__inner">
            <div className="portal-cards-section__header">
              <h2 className="portal-cards-section__title">主要機能</h2>
              <p className="portal-cards-section__subtitle">
                以下のメニューから各機能にアクセスできます
              </p>
            </div>

            <div className="portal-cards-stack">
              {/* 1. 抽出状況参照画面 */}
              <LinkCard
                title="抽出状況参照"
                href="/extraction-status"
              />

              {/* 2. メタデータ参照画面 */}
              <LinkCard
                title="メタデータ参照"
                href="/metadata"
              />

              {/* 3. データプロファイル参照画面 */}
              <LinkCard
                title="データプロファイル参照"
                href="/data-profile"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
