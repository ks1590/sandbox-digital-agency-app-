/**
 * 抽出リクエストの型定義
 * Go+Lambda APIのレスポンスと一致させる
 */
export interface ExtractionRequest {
  requestId: string;
  receptionId: string;
  dataCategory: string;
  extractionDataInfo: string;
  extractionStatus: string;
  receptionTimestamp: string;
  receptionStatus: string;
  completionTimestamp: string;
  resultStatus: string;
  processingTime: string;
  processingTimeSeconds: number;
}

/**
 * API レスポンスの型定義
 */
export interface ExtractionStatusResponse {
  requests: ExtractionRequest[];
}
