import { useCallback, useEffect, useState } from "react";
import { fetchExtractionStatus } from "./api";
import type { ExtractionRequest } from "./types";

interface UseExtractionStatusReturn {
  /** 取得したデータ */
  data: ExtractionRequest[];
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ（エラー時のみ） */
  error: string | null;
  /** 検索条件を指定してデータを再取得する */
  search: (params: { year?: string; month?: string }) => Promise<void>;
}

/**
 * 抽出ステータスデータの取得・検索を管理するカスタムフック
 *
 * - 初回マウント時に全件取得
 * - search() で検索条件付きの再取得
 */
export function useExtractionStatus(): UseExtractionStatusReturn {
  const [data, setData] = useState<ExtractionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** データ取得の共通処理 */
  const fetchData = useCallback(
    async (params?: { year?: string; month?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchExtractionStatus(params);
        setData(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "データの取得中にエラーが発生しました";
        setError(message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 初回マウント時にデータを取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** 検索条件を指定してデータを再取得する */
  const search = useCallback(
    async (params: { year?: string; month?: string }) => {
      await fetchData(params);
    },
    [fetchData],
  );

  return { data, isLoading, error, search };
}
