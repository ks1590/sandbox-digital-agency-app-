"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LinkCard from "@/components/ui/LinkCard";
import type { MetadataResponse } from "../types";
import type { MetadataFormData } from "./schema";

/**
 * メタデータトップページ用のクライアントコンポーネント
 * サーバーから受け取ったデータを初期表示し、モック環境用としてsessionStorageがあれば上書きする
 */
export default function MetadataContent({ data }: { data: MetadataResponse }) {
  const [sessionData, setSessionData] = useState<MetadataFormData | null>(null);

  // 今回はモックAPI環境のため、サーバー側にはデータが永続化されない。
  // そのため、画面リロード時や遷移時に更新内容を反映できるよう sessionData を優先する。
  useEffect(() => {
    const saved = sessionStorage.getItem("metadata_clinical");
    if (saved) {
      try {
        setSessionData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const overviewText = sessionData?.overviewText ?? data.overview.overviewText;
  const dataTypes = sessionData?.dataTypes ?? data.overview.dataTypes;
  const keyInfoText = sessionData?.keyInfoText ?? data.overview.keyInfoText;

  return (
    <>
      {/* 概要セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">概要</h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {overviewText}
        </p>
      </section>

      {/* データ種別セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">データ種別</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dataTypes.map((dt) => (
            <LinkCard key={dt.id} href={`/metadata/${dt.id}`} title={dt.name} />
          ))}
        </div>
      </section>

      {/* キー情報セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">キー情報</h3>
        <div className="p-6 border border-gray-300 rounded-lg bg-white min-h-[120px]">
          {keyInfoText ? (
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {keyInfoText}
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-center">キー情報</p>
          )}
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
