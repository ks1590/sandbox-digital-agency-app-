"use client";

import { useState, useCallback, useId, type ReactNode } from "react";
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
}

export default function Tab({
  items,
  headingId,
  defaultIndex = 0,
  position,
  onChange,
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
        {items.map((item, index) => (
          <li key={getPanelId(item, index)}>
            <a
              href={`#${getPanelId(item, index)}`}
              className="dads-tab__tab"
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(index);
              }}
            >
              <span>{item.label}</span>
            </a>
          </li>
        ))}
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
