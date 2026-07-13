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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const maxLeft =
        typeof window !== "undefined" ? window.innerWidth - 320 : 0;
      setPosition({
        top: rect.top - 4, // 少し上に被せる
        left: Math.min(rect.left - 8, maxLeft > 0 ? maxLeft : rect.left),
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

  if (!isTruncated) {
    return <span>{text}</span>;
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="cursor-default outline-none text-left"
      >
        {displayText}
      </button>

      {isOpen && (
        <div
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          onFocus={handleTooltipMouseEnter}
          onBlur={handleTooltipMouseLeave}
          role="tooltip"
          className="fixed z-[100] bg-white border border-gray-900 p-2 text-sm text-gray-900 shadow-md whitespace-pre-wrap break-all max-w-[400px]"
          style={{ top: position.top, left: position.left }}
        >
          {text}
        </div>
      )}
    </>
  );
}
