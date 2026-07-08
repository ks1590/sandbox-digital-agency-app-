import { useCallback, useEffect, useState } from "react";
import { fetchDataProfile } from "./api";
import type { DataProfileResponse } from "./types";

interface UseDataProfileReturn {
  /** 取得したデータ */
  data: DataProfileResponse | null;
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ（エラー時のみ） */
  error: string | null;
}

/**
 * データプロファイルの取得を管理するカスタムフック
 *
 * - 初回マウント時にデータを取得
 */
export function useDataProfile(): UseDataProfileReturn {
  const [data, setData] = useState<DataProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** データ取得の共通処理 */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDataProfile();
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "データの取得中にエラーが発生しました";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回マウント時にデータを取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
}
