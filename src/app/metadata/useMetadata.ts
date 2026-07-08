import { useCallback, useEffect, useState } from "react";
import { fetchMetadata } from "./api";
import type { MetadataResponse } from "./types";

interface UseMetadataReturn {
  /** 取得したデータ */
  data: MetadataResponse | null;
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ（エラー時のみ） */
  error: string | null;
}

/**
 * メタデータの取得を管理するカスタムフック
 *
 * - 初回マウント時にデータを取得
 */
export function useMetadata(): UseMetadataReturn {
  const [data, setData] = useState<MetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** データ取得の共通処理 */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchMetadata();
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
