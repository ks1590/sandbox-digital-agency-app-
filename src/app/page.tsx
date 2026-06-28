import { cookies } from "next/headers";
import Header from './components/Header';
import LinkCard from './components/LinkCard';

/**
 * ポータルTOP画面
 *
 * データマネジメントシステムのメインエントリーポイント。
 * 3つの主要機能画面へのリンクカードを提供する。
 */
export default async function PortalPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* ヘッダー */}
      <Header userId={userId} />

      {/* メインコンテンツ */}
      <main className='portal-main' id='mainContainer'>
        {/* リンクカードセクション */}
        <section className='portal-cards-section' id='portal-cards'>
          <div className='portal-cards-section__inner'>
            <div className='portal-cards-section__header'>
              <h2 className='portal-cards-section__title'>メニュー</h2>
            </div>

            <div className='portal-cards-stack'>
              {/* 1. 抽出状況参照画面 */}
              <LinkCard title='抽出状況参照' href='/extraction-status' />

              {/* 2. メタデータ参照画面 */}
              <LinkCard title='メタデータ参照' href='/metadata' />

              {/* 3. データプロファイル参照画面 */}
              <LinkCard title='データプロファイル参照' href='/data-profile' />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
