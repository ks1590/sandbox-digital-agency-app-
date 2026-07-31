"use client";

import DataProfileContent from "./DataProfileContent";
import { useDataProfile } from "./useDataProfile";
export default function DataProfileLoader() {
  const state = useDataProfile();

  if (state.status === "loading") {
    return (
      <div
        className="flex justify-center items-center py-16"
        role="status"
        aria-live="polite"
      >
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="py-16" role="alert" aria-live="assertive">
        <p className="text-red-700 font-bold">
          データの取得に失敗しました。時間をおいて再度お試しください。
        </p>
      </div>
    );
  }

  return <DataProfileContent data={state.data} />;
}
