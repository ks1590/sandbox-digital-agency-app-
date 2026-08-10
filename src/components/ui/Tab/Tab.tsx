"use client";

import { type ReactNode, useCallback, useId, useState } from "react";
import "./Tab.css";

/**
 * タブ項目の定義
 * @property label - タブに表示するラベルテキスト
 * @property id - タブとパネルの紐付けに使用する一意のID（省略時は自動生成）
 * @property content - タブパネルに表示するコンテンツ
 */
export interface TabItem {
  label: string;
  id?: string;
  content: ReactNode;
}

/**
 * Tab コンポーネントのProps
 * @property items - タブ項目の配列
 * @property headingId - タブ全体の見出し要素のID（aria-labelledby用）
 * @property defaultIndex - 初期選択するタブのインデックス（デフォルト: 0）
 * @property position - タブリストの配置位置（デフォルト: "top"）
 * @property onChange - タブ切替時のコールバック
 */
export interface TabProps {
  items: TabItem[];
  headingId: string;
  defaultIndex?: number;
  position?: "top" | "bottom" | "left" | "right";
  onChange?: (index: number, label: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export default function Tab({
  items,
  headingId,
  defaultIndex = 0,
  position,
  onChange,
  disabled,
  disabledReason,
}: TabProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const autoId = useId();

  const handleTabClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onChange?.(index, items[index].label);
    },
    [items, onChange],
  );

  const getPanelId = (item: TabItem, index: number): string => {
    return item.id ?? `${autoId}-panel-${index}`;
  };

  const dataPosition = position && position !== "top" ? position : undefined;

  return (
    <div
      className="dads-tab"
      {...(dataPosition ? { "data-position": dataPosition } : {})}
    >
      <ul className="dads-tab__list" aria-labelledby={headingId}>
        {items.map((item, index) => {
          const isDisabled = disabled && index !== activeIndex;
          const isFirst = index === 0;
          // Use left-0 for the first tab to prevent left-side cutoff.
          // For all other tabs, center the tooltip.
          const tooltipPosClass = isFirst ? "left-0" : "left-1/2 -translate-x-1/2";
          const arrowPosClass = isFirst ? "left-8" : "left-1/2 -translate-x-1/2";

          return (
            <li key={getPanelId(item, index)}>
              <a
                href={`#${getPanelId(item, index)}`}
                className={`dads-tab__tab group relative ${isDisabled ? "cursor-not-allowed bg-gray-50" : ""}`}
                aria-current={index === activeIndex ? "true" : undefined}
                aria-disabled={disabled}
                onClick={(e) => {
                  e.preventDefault();
                  if (isDisabled) return;
                  handleTabClick(index);
                }}
              >
                <span className={isDisabled ? "opacity-50" : ""}>{item.label}</span>
                {isDisabled && disabledReason && (
                  <div className={`absolute bottom-full mb-2 hidden group-hover:block z-50 w-[260px] ${tooltipPosClass}`}>
                    <div className="bg-gray-800 text-white text-[15px] font-normal py-2 px-3 rounded shadow-lg whitespace-pre-wrap leading-relaxed text-left">
                      {disabledReason}
                    </div>
                    <div className={`absolute top-full border-4 border-transparent border-t-gray-800 ${arrowPosClass}`}></div>
                  </div>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="dads-tab__panels">
        {items.map((item, index) => (
          <div
            key={getPanelId(item, index)}
            id={getPanelId(item, index)}
            className="dads-tab__panel"
            hidden={index !== activeIndex}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
