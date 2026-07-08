import mockData from "./data.json";
import type { ExtractionRequest, ExtractionStatusResponse } from "./types";

/**
 * APIのベースURL
 * 本番APIが利用可能になったら環境変数 NEXT_PUBLIC_API_BASE_URL に設定する。
 * 未設定の場合はモックデータにフォールバックする。
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 抽出ステータス一覧を取得する
 *
 * @param params.year - 検索する受付年（例: "2026"）。省略時はフィルタなし。
 * @param params.month - 検索する受付月（例: "05"）。省略時はフィルタなし。
 * @returns 抽出リクエスト一覧
 *
 * APIが利用可能な場合はAPIから取得し、
 * 利用不可の場合はローカルのモックデータにフォールバックする。
 */
export async function fetchExtractionStatus(params?: {
  year?: string;
  month?: string;
}): Promise<ExtractionRequest[]> {
  // API URLが設定されている場合はAPIから取得を試みる
  if (API_BASE_URL) {
    try {
      const url = new URL(`${API_BASE_URL}/extraction-status`);

      if (params?.year) {
        url.searchParams.set("year", params.year);
      }
      if (params?.month) {
        url.searchParams.set("month", params.month);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API エラー: ${response.status} ${response.statusText}`,
        );
      }

      const data: ExtractionStatusResponse = await response.json();
      return data.requests;
    } catch (error) {
      console.error(
        "API からのデータ取得に失敗しました。モックデータを使用します:",
        error,
      );
      // APIエラー時はモックデータにフォールバック
      return filterMockData(mockData.requests, params);
    }
  }

  // API URLが未設定の場合はモックデータを返す
  console.info(
    "NEXT_PUBLIC_API_BASE_URL が未設定のため、モックデータを使用します。",
  );
  return filterMockData(mockData.requests, params);
}

/**
 * モックデータに対してフロントエンド側でフィルタリングを適用する。
 * 実際のAPIではサーバーサイドでフィルタリングされる想定。
 */
function filterMockData(
  data: ExtractionRequest[],
  params?: { year?: string; month?: string },
): ExtractionRequest[] {
  let result = data;

  if (params?.year) {
    result = result.filter((request) =>
      request.receptionTimestamp.startsWith(params.year as string),
    );
  }

  if (params?.month) {
    const formattedMonth = params.month.padStart(2, "0");
    result = result.filter(
      (request) =>
        request.receptionTimestamp.substring(5, 7) === formattedMonth,
    );
  }

  return result;
}
