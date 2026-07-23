"use client";

import { useEffect, useRef, useState } from "react";

interface TextPopoverProps {
  text: string;
  maxLength?: number;
}

export default function TextPopover({
  text,
  maxLength = 20,
}: TextPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);

  const elementRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  // 毎レンダー後にoverflow判定を行う（textやレイアウト変更を自然に検知）
  useEffect(() => {
    const el = elementRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  });

  // ウィンドウリサイズ時にoverflow判定を再実行する
  useEffect(() => {
    const checkOverflow = () => {
      const el = elementRef.current;
      if (el) {
        setIsOverflowing(el.scrollWidth > el.clientWidth);
      }
    };
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const handleMouseEnter = () => {
    if (!isOverflowing) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      // 親セル（td）の幅を取得してツールチップの幅に使う
      const parentCell = elementRef.current.closest("td");
      const cellWidth = parentCell
        ? parentCell.getBoundingClientRect().width
        : rect.width;
      const maxLeft =
        typeof window !== "undefined" ? window.innerWidth - cellWidth - 16 : 0;
      setPosition({
        top: rect.top - 4, // 少し上に被せる
        left: Math.min(rect.left - 8, maxLeft > 0 ? maxLeft : rect.left),
        width: cellWidth,
      });
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleTooltipMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const className =
    "cursor-default outline-none text-left block truncate max-w-full";

  if (!isOverflowing) {
    return (
      <span
        ref={elementRef as React.RefObject<HTMLSpanElement>}
        className={className}
      >
        {text}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        ref={elementRef as React.RefObject<HTMLButtonElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className={className}
      >
        {text}
      </button>

      {isOpen && (
        <div
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          onFocus={handleTooltipMouseEnter}
          onBlur={handleTooltipMouseLeave}
          role="tooltip"
          className="fixed z-[100] bg-white border border-gray-900 p-2 text-sm text-gray-900 shadow-md whitespace-pre-wrap break-all"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
          }}
        >
          {text}
        </div>
      )}
    </>
  );
}
