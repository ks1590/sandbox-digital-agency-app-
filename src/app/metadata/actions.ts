"use server";

import type { MetadataFormData } from "./_components/schema";

/**
 * メタデータを保存する Server Action
 * ブラウザから直接呼び出され、サーバー側でAPI通信などを行います。
 */
export async function saveMetadataAction(data: MetadataFormData) {
  // 実際のプロダクトでは、ここでGoなどの外部APIにPOST/PUTリクエストを送信します。
  // 例:
  // const response = await fetch(`${process.env.API_BASE_URL}/metadata`, {
  //   method: "PUT",
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("保存に失敗しました");

  console.info("サーバー側でメタデータ保存リクエストを受信しました", {
    dataType: data.dataType,
    tablesCount: data.tables?.length,
  });

  // モックとして少しだけ待機（API通信のシミュレーション）
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 成功したことをクライアントに返す
  return { success: true };
}
