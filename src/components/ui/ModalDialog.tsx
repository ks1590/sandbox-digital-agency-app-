import type React from "react";
import { forwardRef } from "react";

export const ModalDialog = forwardRef<
  HTMLDialogElement,
  React.ComponentProps<"dialog">
>(({ children, className = "", onClick, ...props }, ref) => {
  return (
    // 背景（バックドロップ）クリックでモーダルを閉じるための処理です。
    // Escapeキーでの閉じる処理は <dialog> 要素がネイティブでサポートしているため、カスタムのキーボードイベントは不要です。
    // biome-ignore lint/a11y/useKeyWithClickEvents: <dialog> natively handles Escape key for closing, so a custom keyboard handler is unnecessary for the backdrop click
    <dialog
      ref={ref}
      className={`bg-transparent p-0 backdrop:bg-black/50 overflow-visible ${className}`}
      onClick={(e) => {
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

export const ModalDialogContent = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    // モーダル内部のクリックが背景に伝播してモーダルが閉じてしまうのを防ぐための構造的なイベントハンドラー
    // インタラクティブなウィジェット（ボタン等）ではないため、キーボード対応やロールの付与は不要とする
    // biome-ignore lint/a11y/noStaticElementInteractions: this is a structural element stopping click propagation, not an interactive widget
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is a structural element stopping click propagation, not an interactive widget
    <div
      className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

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
