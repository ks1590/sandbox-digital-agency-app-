"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import LinkCard from "@/components/ui/LinkCard";

export default function PortalPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("login-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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
              {userId === "test-userA" && (
                <LinkCard title="月次抽出依頼検索" href="/extraction-status" />
              )}
              {userId === "test-userB" && (
                <>
                  <LinkCard title="メタデータ参照・登録" href="/metadata" />
                  <LinkCard
                    title="データプロファイル参照"
                    href="/data-profile"
                  />
                </>
              )}
              {/* For safety, if other users log in, you could show all or none */}
              {!userId && (
                <div className="text-gray-500">メニューを読み込み中...</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
