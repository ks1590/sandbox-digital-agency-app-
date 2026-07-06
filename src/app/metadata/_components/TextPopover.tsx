'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TextPopoverProps {
  text: string;
  maxLength?: number;
}

export default function TextPopover({ text, maxLength = 10 }: TextPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.slice(0, maxLength) + '...' : text;

  const togglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const maxLeft = typeof window !== 'undefined' ? window.innerWidth - 320 : 0;
      setPosition({
        top: rect.top - 8, // セルの位置に被せる
        left: Math.min(rect.left - 8, maxLeft > 0 ? maxLeft : rect.left),
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  if (!isTruncated) {
    return <span>{text}</span>;
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePopover}
        className="text-left hover:text-[#0017C1] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded px-1 -ml-1 transition-colors group"
        aria-expanded={isOpen}
      >
        {displayText}
        <svg
          className="inline-block w-4 h-4 ml-1 text-gray-400 group-hover:text-[#0017C1]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="fixed z-[100] w-[300px] bg-white border border-gray-400 rounded-lg shadow-xl p-3 ring-4 ring-black ring-offset-2 ring-yellow-300 break-words text-gray-900 text-base"
          style={{ top: position.top, left: position.left }}
        >
          <div className="w-full min-h-[160px] p-2 border border-gray-300 rounded overflow-y-auto">
            {text}
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#0017C1] text-white rounded font-bold text-sm hover:bg-[#1A30C9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
              onClick={() => setIsOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
