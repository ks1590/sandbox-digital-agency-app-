"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // クライアントサイドでローカルストレージから取得
    const storedUserId = localStorage.getItem("login-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 外側クリックでメニューを閉じる処理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("login-user-id");
    router.replace("/login");
  };

  return (
    <header className="portal-header" id="portal-header">
      <div className="portal-header__inner relative">
        <div className="portal-header__logo">
          <Link href="/" className="flex items-center gap-[14px]">
            <div>
              <h1 className="portal-header__title">診療情報DB</h1>
            </div>
          </Link>
        </div>

        {/* 右側アクションエリア：ユーザー名表示 + ハンバーガーメニュー */}
        <div className="flex items-center gap-4">
          {userId && (
            <div className="hidden sm:inline-flex items-center content-center min-h-8 text-gray-900 py-1 px-2 text-base">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-gray-900 mr-1 self-center"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
              {userId}
            </div>
          )}

          {/* ハンバーガーメニュー */}
          {userId && (
            <div ref={menuRef}>
              <button
                type="button"
                className="flex w-fit touch-manipulation items-center gap-x-1 rounded-[6px] px-3 pb-1.5 pt-1 text-base text-gray-900 hover:bg-gray-100 hover:underline hover:underline-offset-[3px] focus-visible:bg-yellow-300 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <>
                    <svg
                      aria-hidden={true}
                      className="mt-0.5 flex-none"
                      fill="none"
                      height="24"
                      viewBox="0 0 120 120"
                      width="24"
                    >
                      <path
                        d="M32 95L25 88L53 60L25 32L32 25L60 53L88 25L95 32L67 60L95 88L88 95L60 67L32 95Z"
                        fill="currentColor"
                      />
                    </svg>
                    閉じる
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden={true}
                      className="mt-0.5 flex-none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path
                        clipRule="evenodd"
                        d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                    メニュー
                  </>
                )}
              </button>

              {/* メニューパネル */}
              {isMenuOpen && (
                <div className="absolute right-6 top-full mt-2 w-64 bg-white border border-gray-400 shadow-lg rounded-md z-50 overflow-hidden">
                  <ul className="flex flex-col">
                    {userId === "test-userA" && (
                      <li>
                        <Link
                          href="/extraction-status"
                          className="block px-4 py-3 hover:bg-gray-100 hover:underline hover:underline-offset-2 text-gray-900"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          月次抽出依頼検索
                        </Link>
                      </li>
                    )}
                    {userId === "test-userB" && (
                      <>
                        <li className="border-t border-gray-200">
                          <Link
                            href="/metadata"
                            className="block px-4 py-3 hover:bg-gray-100 hover:underline hover:underline-offset-2 text-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            メタデータ参照・登録
                          </Link>
                        </li>
                        <li className="border-t border-gray-200">
                          <Link
                            href="/data-profile"
                            className="block px-4 py-3 hover:bg-gray-100 hover:underline hover:underline-offset-2 text-gray-900"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            データプロファイル参照
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="border-t border-gray-200">
                      <button
                        type="button"
                        className="w-full text-left block px-4 py-3 hover:bg-gray-100 hover:underline hover:underline-offset-2 text-gray-900"
                        onClick={handleLogout}
                      >
                        ログアウト
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
