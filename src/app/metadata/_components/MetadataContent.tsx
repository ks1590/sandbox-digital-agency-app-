"use client";

import Link from "next/link";
import LinkCard from "../../../components/ui/LinkCard";
import { useMetadata } from "../useMetadata";

/**
 * メタデータトップページ用のクライアントコンポーネント
 * useMetadata フックでデータを取得し、ローディング/エラー/データ表示を制御する
 */
export default function MetadataContent() {
  const { data, isLoading, error } = useMetadata();

  // エラー表示
  if (error) {
    return (
      <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        <p className="font-bold">データ取得エラー</p>
        <p>{error}</p>
      </div>
    );
  }

  // ローディング表示
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">データを読み込み中...</p>
      </div>
    );
  }

  const { overview } = data;

  return (
    <>
      {/* 概要セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">概要</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {overview.overviewText}
        </p>
      </section>

      {/* データ種別セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">データ種別</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {overview.dataTypes.map((dt) => (
            <LinkCard key={dt.id} href={`/metadata/${dt.id}`} title={dt.name} />
          ))}
        </div>
      </section>

      {/* キー情報セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">キー情報</h3>
        <div className="p-6 border border-gray-300 rounded-lg bg-white min-h-[120px]">
          <p className="text-sm text-gray-500 text-center">キー情報</p>
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
        >
          戻る
        </Link>
      </div>
    </>
  );
}
