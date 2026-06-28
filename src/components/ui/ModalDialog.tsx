import React, { forwardRef } from "react";

/**
 * モーダルダイアログのラッパー (HTML <dialog> 要素を使用)
 */
export const ModalDialog = forwardRef<
  HTMLDialogElement,
  React.ComponentProps<"dialog">
>(({ children, className = "", onClick, ...props }, ref) => {
  return (
    <dialog
      ref={ref}
      className={`bg-transparent p-0 backdrop:bg-black/50 overflow-visible ${className}`}
      onClick={(e) => {
        // ダイアログの背景（backdrop）がクリックされたら閉じる処理
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </dialog>
  );
});
ModalDialog.displayName = "ModalDialog";

/**
 * モーダルの白いコンテンツ領域
 */
export const ModalDialogContent = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()} // backdropクリック時の閉じるイベントが伝播しないようにする
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * モーダルヘッダー領域
 */
export const ModalDialogHeader = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-5 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * モーダルのタイトル
 */
export const ModalDialogHeading = forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ children, className = "", ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-xl font-bold text-gray-900 m-0 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
});
ModalDialogHeading.displayName = "ModalDialogHeading";

/**
 * モーダルの本文コンテンツ領域
 */
export const ModalDialogBody = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-6 text-gray-700 whitespace-pre-wrap ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * モーダルのアクション（ボタン）領域
 */
export const ModalDialogActions = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
