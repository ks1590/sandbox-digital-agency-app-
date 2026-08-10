"use client";

import { useEffect } from "react";

export default function TestErrorPage() {
  useEffect(() => {
    // 意図的にエラーを発生させる
    throw new Error("動作確認用のテストエラーです");
  }, []);

  return <div>エラーを発生させています...</div>;
}
