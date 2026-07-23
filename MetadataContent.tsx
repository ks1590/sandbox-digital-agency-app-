"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinkCard from "@/components/ui/LinkCard";
import type { MetadataResponse } from "../../types";

const MarkdownEditor = dynamic(() => import("@/components/ui/MarkdownEditor"), {
  ssr: false,
});

import type { MetadataFormData } from "../schema";

/**
 * メタデータトップページ用のクライアントコンポーネント
 * サーバーから受け取ったデータを初期表示し、モック環境用としてsessionStorageがあれば上書きする
 */
export default function MetadataContent({ data }: { data: MetadataResponse }) {
  const [sessionData, setSessionData] = useState<MetadataFormData | null>(null);

  // 今回はモックAPI環境のため、サーバー側にはデータが永続化されない。
  // そのため、画面リロード時や遷移時に更新内容を反映できるよう sessionData を優先する。
  useEffect(() => {
    const saved = sessionStorage.getItem("metadata_top");
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
        {overviewText ? (
          <MarkdownEditor
            key={`overview-${overviewText}`}
            markdown={overviewText}
            readOnly={true}
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            データがありません
          </p>
        )}
      </section>

      {/* データ種別セクション */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-4">データ種別</h3>
        <div className="flex flex-wrap gap-6 py-4">
          {dataTypes.map((dt) => (
            <LinkCard key={dt.id} href={`/metadata/detail?type=${dt.id}`} title={dt.name} />
          ))}
        </div>
      </section>
    </>
  );
}
