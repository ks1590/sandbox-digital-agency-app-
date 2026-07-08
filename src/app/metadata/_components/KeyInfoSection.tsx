"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { MetadataFormData } from "./schema";
import { labelClass, textareaClass } from "./styles";

/**
 * キー情報セクション（Mermaid記法エディタ + SVGプレビュー）
 *
 * Mermaidのdynamic importとレンダリング副作用を
 * MetadataEditから分離するためのコンポーネント。
 */
export default function KeyInfoSection() {
  const { register, watch } = useFormContext<MetadataFormData>();
  const keyInfoText = watch("keyInfoText") || "";
  const [mermaidSvg, setMermaidSvg] = useState<string>("");
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const renderMermaid = async () => {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        mermaid.initialize({ startOnLoad: false, theme: "default" });

        if (keyInfoText.trim() !== "") {
          // ユニークなIDを付与してレンダリング
          const id = `mermaid-svg-${Math.random().toString(36).substring(2, 11)}`;
          const { svg } = await mermaid.render(id, keyInfoText);
          if (isMounted) {
            setMermaidSvg(svg);
            setMermaidError(null);
          }
        } else {
          if (isMounted) {
            setMermaidSvg("");
            setMermaidError(null);
          }
        }
      } catch (error: any) {
        if (isMounted) {
          setMermaidError(error.message || "Mermaid構文エラー");
          setMermaidSvg("");
        }
      }
    };

    timeoutId = setTimeout(() => {
      renderMermaid();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [keyInfoText]);

  return (
    <section>
      <h3 className="text-xl font-bold mb-4">キー情報</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="keyInfoText" className={labelClass}>
            Mermaid記法で図を記述
          </label>
          <textarea
            id="keyInfoText"
            className={textareaClass}
            {...register("keyInfoText")}
            placeholder={
              "graph TD;\n  A[利用者] --> B(ビジネスメタデータ登録);\n  B --> C{検証};\n  C -->|成功| D[データ保存];\n  C -->|失敗| E[エラー表示];"
            }
          />
        </div>
        <div className="flex flex-col">
          <span className={labelClass}>プレビュー</span>
          <div className="flex-1 border border-gray-400 rounded-[8px] bg-white p-4 min-h-[120px] flex items-center justify-center overflow-auto">
            {mermaidError ? (
              <div className="text-error-1 text-sm whitespace-pre-wrap">
                {mermaidError}
              </div>
            ) : mermaidSvg ? (
              <div
                dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                className="max-w-full h-auto flex justify-center"
              />
            ) : (
              <div className="text-gray-500 text-sm">
                プレビューが表示されます
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
