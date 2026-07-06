"use client";

import Link from "next/link";
import { useState, useEffect, useId } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Header from "../../../components/layout/Header";
import Tab from "../../../components/ui/Tab";
import { NotificationBanner } from "../../../components/layout/NotificationBanner/NotificationBanner";
import { NotificationBannerBody } from "../../../components/layout/NotificationBanner/parts/Body";
import TableDefContent, { TableDefGrid } from "./TableDefContent";

import {
  FileUpload,
  FileUploadDropArea,
  FileUploadFileInfo,
  FileUploadFileItem,
  FileUploadFileList,
  FileUploadFileMarker,
  FileUploadFileMeta,
  FileUploadFileName,
  FileUploadInput,
  FileUploadViewportOverlay,
  FileUploadViewportOverlayMessage,
} from "../../../components/form/FileUpload/FileUpload";
import { useFileUpload } from "../../../components/form/FileUpload/hooks/useFileUpload";
import { fileUploadDefaultMessages } from "../../../components/form/FileUpload/messages";
import { formatSize } from "../../../components/form/FileUpload/utils";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Label } from "../../../components/ui/Label";
import { RequirementBadge } from "../../../components/ui/RequirementBadge";
import { SupportText } from "../../../components/ui/SupportText";

/** クライアントサイドでのCookie取得（簡易実装） */
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return undefined;
}

export default function MetadataEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabParam = searchParams.get("tab") || "overview";
  const subtabParam = searchParams.get("subtab");
  
  let defaultIndex = 0;
  if (tabParam === "er") defaultIndex = 1;
  else if (tabParam === "table-def") defaultIndex = 2;

  const [userId, setUserId] = useState<string | undefined>();
  const [notification, setNotification] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const [keyInfoText, setKeyInfoText] = useState<string>("");
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

  useEffect(() => {
    setUserId(getCookie("login-user-id"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // pathnameから mode パラメータを除外して参照画面に戻る
    const viewParams = new URLSearchParams();
    viewParams.set("tab", tabParam);
    viewParams.set("success", "true");
    router.push(`${pathname}?${viewParams.toString()}`);
  };

  const handleErrorSubmit = () => {
    setNotification({
      type: "error",
      title: "操作を完了できませんでした",
      message: "入力内容に誤りがあります。エラーメッセージを確認してください。",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass =
    "block w-full rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300";
  const textareaClass =
    "block w-full min-h-[120px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300";
  const labelClass = "block text-sm font-bold text-gray-900 mb-2";

  const {
    files,
    errors,
    isDragOver,
    hasError,
    totalSize,
    selectionSummarySuffix,
    inputRef,
    selectButtonRef,
    removeFile,
    handleSelectButtonClick,
    handleInputChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isExpandedDropArea,
    showViewportOverlay,
    handleExpandedDropAreaChange,
    handleViewportDragEnter,
    handleViewportDragOver,
    handleViewportDragLeave,
    handleViewportDrop,
  } = useFileUpload({
    maxFiles: 1,
    maxFileSize: "5MB",
    accept: ".png,.jpg,.jpeg",
    droppable: true,
    dropAreaExpandable: true,
  });

  const buttonId = useId();
  const inputId = useId();
  const labelId = useId();
  const supportTextId = useId();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0 && files[0].file) {
      const url = URL.createObjectURL(files[0].file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [files]);

  const erDiagramContent = (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label id={labelId} htmlFor={inputId}>
          参照する画像・ドキュメント
          <RequirementBadge isOptional>※任意</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>
          対応ファイル：PNG/JPEG形式の画像
          <br />
          1ファイルまで選択可能。1ファイルあたり5MB（5,242,880バイト）まで
        </SupportText>
        <FileUpload
          className="mt-2"
          maxFiles={1}
          hasError={hasError}
          droppable={true}
        >
          <FileUploadInput
            id={inputId}
            name="er-diagram-upload"
            accept=".png,.jpg,.jpeg"
            ref={inputRef}
            onChange={handleInputChange}
          />

          <div>
            <FileUploadDropArea
              isDragOver={isDragOver}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                <Button
                  id={buttonId}
                  type="button"
                  variant="outline"
                  size="md"
                  className={`
                    shrink-0
                    group-data-[dragover=true]/drop-area:bg-key-300 group-data-[dragover=true]/drop-area:text-key-1200 group-data-[dragover=true]/drop-area:underline
                    group-data-[has-error=true]/file-upload:border-error-1
                    data-[dragover=true]:bg-key-300 data-[dragover=true]:text-key-1200 data-[dragover=true]:underline
                  `}
                  onClick={handleSelectButtonClick}
                  ref={selectButtonRef}
                  aria-labelledby={`${labelId} ${buttonId}`}
                >
                  ファイルを選択
                </Button>
                <p className="w-0 grow min-w-[12em] text-gray-700">
                  または、このエリア内にドラッグ＆ドロップ
                </p>
              </div>
              {files.length > 0 && (
                <p
                  id={`summary-${selectionSummarySuffix}`}
                  className="mt-2 text-sm text-gray-700"
                >
                  選択中：{files.length}個、{formatSize(totalSize)}（
                  {totalSize.toLocaleString()}バイト）
                </p>
              )}
              {errors.length > 0 && (
                <ul className="mt-2 p-0 list-none text-error-1 text-sm">
                  {errors.map((error) => (
                    <li key={error}>＊{error}</li>
                  ))}
                </ul>
              )}
              <p className="mt-12 -mb-4 -ml-1">
                <Checkbox
                  size="md"
                  checked={isExpandedDropArea}
                  onChange={(e) =>
                    handleExpandedDropAreaChange(e.target.checked)
                  }
                >
                  ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる
                </Checkbox>
              </p>
            </FileUploadDropArea>

            {files.length > 0 && (
              <FileUploadFileList>
                {files.map((file, index) => {
                  const hasFileError = file.errors && file.errors.length > 0;
                  return (
                    <FileUploadFileItem
                      key={file.id}
                      data-id={file.id}
                      hasError={hasFileError}
                    >
                      <FileUploadFileMarker />
                      <FileUploadFileInfo>
                        <p>
                          <FileUploadFileName id={`${file.id}-name`}>
                            {file.name}
                          </FileUploadFileName>
                          <FileUploadFileMeta>
                            <span>{formatSize(file.size)}</span>（
                            <span>{file.size.toLocaleString()}</span>バイト）
                          </FileUploadFileMeta>
                        </p>
                        {hasFileError &&
                          file.errors?.map((error) => (
                            <p key={error} className="text-error-1 text-sm">
                              ＊{error}
                            </p>
                          ))}
                      </FileUploadFileInfo>
                      <Button
                        id={`${file.id}-remove`}
                        type="button"
                        variant="text"
                        size="xs"
                        className="order-[-1] shrink-0 min-w-12 min-h-[calc(30/16*1rem)] text-oln-16B-100 text-[#0017C1]"
                        onClick={() => removeFile(file.id, index)}
                        aria-labelledby={`${file.id}-remove ${file.id}-name`}
                      >
                        解除
                      </Button>
                    </FileUploadFileItem>
                  );
                })}
              </FileUploadFileList>
            )}
          </div>

          {isExpandedDropArea && showViewportOverlay && (
            <FileUploadViewportOverlay
              onDragEnter={handleViewportDragEnter}
              onDragOver={handleViewportDragOver}
              onDragLeave={handleViewportDragLeave}
              onDrop={handleViewportDrop}
            >
              <FileUploadViewportOverlayMessage>
                <span className="inline-block">このエリア内にファイルを</span>
                <span className="inline-block">ドラッグ＆ドロップ</span>
              </FileUploadViewportOverlayMessage>
            </FileUploadViewportOverlay>
          )}
        </FileUpload>
      </div>

      {previewUrl && (
        <div className="mt-6 border border-gray-300 rounded-lg p-4 bg-gray-50 flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="ER図プレビュー"
            className="max-w-full h-auto object-contain max-h-[600px] border border-gray-200"
          />
        </div>
      )}
    </div>
  );

  const overviewContent = (
    <div className="space-y-10 py-6">
      <div className="mb-4">
        <label htmlFor="dataType" className={labelClass}>
          データ種別
        </label>
        <span className="relative inline-block w-64">
          <select
            id="dataType"
            className="block w-full h-14 appearance-none border border-gray-400 rounded-[8px] bg-white pl-4 pr-10 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300"
            defaultValue="clinical"
          >
            <option value="clinical">臨床情報</option>
            <option value="claim">レセプト情報</option>
            <option value="health_check">健診情報</option>
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-900"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              d="M13.3344 4.40002L8.00104 9.73336L2.66771 4.40002L1.73438 5.33336L8.00104 11.6L14.2677 5.33336L13.3344 4.40002Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">概要</h3>
        <label htmlFor="overviewText" className="sr-only">
          概要の説明
        </label>
        <textarea
          id="overviewText"
          className={textareaClass}
          defaultValue="概要の説明 概要の説明 概要の説明..."
        />
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">収集期間</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label htmlFor="startYear" className={labelClass}>
              収集開始年度
            </label>
            <input
              type="text"
              id="startYear"
              className={inputClass}
              defaultValue="2020年"
            />
          </div>
          <div>
            <label htmlFor="latestYear" className={labelClass}>
              最新の提供可能年度
            </label>
            <input
              type="text"
              id="latestYear"
              className={inputClass}
              defaultValue="2026年"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">更新頻度</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left font-bold text-gray-900 border-r border-gray-300 w-1/2">
                  対象項目
                </th>
                <th className="py-3 px-4 text-left font-bold text-gray-900 w-1/2">
                  頻度
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 border-r border-gray-200">
                  <input
                    type="text"
                    aria-label="対象項目1"
                    className={inputClass}
                    defaultValue="項目名A"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    aria-label="頻度1"
                    className={inputClass}
                    defaultValue="年次"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 border-r border-gray-200">
                  <input
                    type="text"
                    aria-label="対象項目2"
                    className={inputClass}
                    defaultValue="項目名B"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    aria-label="頻度2"
                    className={inputClass}
                    defaultValue="月次"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6">テーブル一覧</h3>
        <div className="space-y-8">
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h4 className="text-lg text-gray-900 font-bold mb-4 border-l-4 border-[#0017C1] pl-3">
              〇〇テーブル
            </h4>
            <div className="space-y-6">
              <div>
                <label htmlFor="table1Overview" className={labelClass}>
                  概要
                </label>
                <textarea
                  id="table1Overview"
                  className={textareaClass}
                  defaultValue="テーブル概要の説明..."
                />
              </div>
              <div>
                <label htmlFor="table1Unit" className={labelClass}>
                  格納単位
                </label>
                <input
                  type="text"
                  id="table1Unit"
                  className={inputClass}
                  defaultValue="レセプト"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h4 className="text-lg text-gray-900 font-bold mb-4 border-l-4 border-[#0017C1] pl-3">
              △△テーブル
            </h4>
            <div className="space-y-6">
              <div>
                <label htmlFor="table2Overview" className={labelClass}>
                  概要
                </label>
                <textarea
                  id="table2Overview"
                  className={textareaClass}
                  defaultValue="テーブル概要の説明..."
                />
              </div>
              <div>
                <label htmlFor="table2Unit" className={labelClass}>
                  格納単位
                </label>
                <input
                  type="text"
                  id="table2Unit"
                  className={inputClass}
                  defaultValue="レセプト"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">留意事項</h3>
        <label htmlFor="notesText" className="sr-only">
          留意事項
        </label>
        <textarea
          id="notesText"
          className={textareaClass}
          defaultValue="留意事項を入力..."
        />
      </section>

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
              value={keyInfoText}
              onChange={(e) => setKeyInfoText(e.target.value)}
              placeholder={"graph TD;\n  A[利用者] --> B(ビジネスメタデータ登録);\n  B --> C{検証};\n  C -->|成功| D[データ保存];\n  C -->|失敗| E[エラー表示];"}
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
    </div>
  );

  const handleTabChange = (index: number) => {
    const tabMap = ["overview", "er", "table-def"];
    const newTab = tabMap[index] || "overview";
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("subtab"); // clean up any subtab param just in case
    
    // Replace URL to preserve tab state without pushing to history stack
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      {notification && (
        <div className="w-full bg-white border-b border-gray-200">
          <div className="page-container py-4">
            <NotificationBanner
              bannerStyle="standard"
              type={notification.type}
              headingLevel="h3"
              title={notification.title}
            >
              <NotificationBannerBody>
                {notification.message}
              </NotificationBannerBody>
            </NotificationBanner>
          </div>
        </div>
      )}

      <main className="page-bg flex-1">
        <div className="page-container pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              メタデータ
            </h2>
          </div>

          {/* 
              フォーム全体でTabを囲むことで、
              どのタブにいても更新ボタンを押した際に全てのデータが送信可能になる。
            */}
          <form onSubmit={handleSubmit} className="text-gray-900">
            <div className="mb-12" hidden={!!subtabParam}>
              <Tab
                headingId="register-tabs-heading"
                defaultIndex={defaultIndex}
                onChange={handleTabChange}
                items={[
                  {
                    label: "概要",
                    id: "tab-overview",
                    content: overviewContent,
                  },
                  {
                    label: "ER図",
                    id: "tab-er",
                    content: erDiagramContent,
                  },
                  {
                    label: "テーブル定義",
                    id: "tab-table-def",
                    content: <TableDefContent />,
                  },
                ]}
              />
            </div>

            {!!subtabParam && (
              <div className="mb-12">
                <Tab
                  headingId="subtab-tabs-heading"
                  defaultIndex={subtabParam === "allergy" ? 1 : subtabParam === "examination" ? 2 : 0}
                  onChange={(index) => {
                    const newSubtab = index === 0 ? "disease" : index === 1 ? "allergy" : "examination";
                    router.push(`${pathname}?mode=edit&tab=table-def&subtab=${newSubtab}`);
                  }}
                  items={[
                    {
                      label: "傷病",
                      id: "subtab-disease",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                    {
                      label: "アレルギー",
                      id: "subtab-allergy",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                    {
                      label: "検査",
                      id: "subtab-examination",
                      content: (
                        <div className="py-6">
                          <TableDefGrid />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}

            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Link
                href={subtabParam ? `/metadata/table-def?tab=${subtabParam}&from=${pathname.split('/').pop()}` : `${pathname}?tab=${tabParam}`}
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300 w-full sm:w-auto"
              >
                キャンセル
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleErrorSubmit}
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-white border border-gray-400 px-4 py-3 text-base font-bold text-error-1 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
                >
                  エラーテスト
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-[#0017C1] px-4 py-3 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
                >
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
