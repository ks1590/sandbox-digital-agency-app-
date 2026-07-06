"use client";

import { useState, useEffect, useId } from "react";
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
import { formatSize } from "../../../components/form/FileUpload/utils";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Label } from "../../../components/ui/Label";
import { RequirementBadge } from "../../../components/ui/RequirementBadge";
import { SupportText } from "../../../components/ui/SupportText";

/**
 * ER図タブのコンテンツ
 *
 * ファイルアップロード（ドラッグ＆ドロップ対応）と
 * 画像プレビュー表示を担当する。
 * FileUpload関連のstate・hookをすべて内包する。
 */
export default function ErDiagramTabContent() {
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

  return (
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
}
