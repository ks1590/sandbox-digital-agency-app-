import type { MetadataFormData } from "./schema";

/**
 * フォームの入力値を元に、SageMaker等に連携するためのマークダウン文字列を生成します。
 */
export function generateMarkdown(data: MetadataFormData): string {
  const {
    overviewText,
    startYear,
    latestYear,
    collectionFrequency,
    updateFrequencies,
    tables,
    notesText,
    keyInfoText,
  } = data;

  // 更新頻度のテーブル行生成
  const frequencyTableRows =
    updateFrequencies && updateFrequencies.length > 0
      ? updateFrequencies
          .map((freq) => `| ${freq.target || "未設定"} | ${freq.frequency || "未設定"} |`)
          .join("\n")
      : "| (未設定) | (未設定) |";

  // テーブル一覧の生成
  const tablesContent =
    tables && tables.length > 0
      ? tables
          .map(
            (t) => `### ${t.logicalName || "未設定"} (${t.physicalName || "未設定"})
- **概要**: ${t.overview || "未設定"}
- **格納単位**: ${t.unit || "未設定"}`
          )
          .join("\n\n")
      : "未設定";

  // テンプレートリテラルでマークダウンを組み立てる
  const markdown = `
# 概要
${overviewText || "未入力"}

## 収集期間
- **収集開始年度**: ${startYear ? `${startYear}年` : "未設定"}
- **最新の提供可能年度**: ${latestYear ? `${latestYear}年` : "未設定"}
- **収集頻度**: ${collectionFrequency || "未設定"}

## 更新頻度
| 対象項目 | 頻度 |
| --- | --- |
${frequencyTableRows}

## テーブル一覧
${tablesContent}

## 留意事項
${notesText || "特になし"}

## キー情報
${keyInfoText || "特になし"}
`;

  return markdown.trim();
}
