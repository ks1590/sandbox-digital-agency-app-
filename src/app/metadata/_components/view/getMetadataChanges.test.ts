import { beforeEach, describe, expect, it } from "vitest";
import { EXAMINATION_MOCK_DATA } from "../../api";
import { CHILD_OVERVIEW_TEMPLATE } from "../../constants";
import { getMetadataChanges } from "./getMetadataChanges";

describe("getMetadataChanges", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("変更がない場合は空配列を返す", () => {
    const changes = getMetadataChanges();
    expect(changes).toEqual([]);
  });

  it("トップの概要が「データベース全体に関する情報」として検出され一文メッセージが生成される", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "変更された概要テキスト",
        datatypeDataProductNames: [
          { identifiler: "臨床情報", name: "臨床情報（更新）" },
          { identifiler: "new-type-1", name: "新規種別" },
        ],
      }),
    );

    const changes = getMetadataChanges();
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "トップ",
          field: "データベース全体に関する情報",
          text: "データベース全体に関する情報を編集しました",
        }),
        expect.objectContaining({
          category: "トップ",
          field: "データ種別",
          text: "データ種別「臨床情報」から「臨床情報（更新）」へ名称変更しました",
        }),
        expect.objectContaining({
          category: "トップ",
          field: "データ種別",
          text: "データ種別「新規種別」を追加しました",
        }),
      ]),
    );
  });

  it("詳細画面の概要が「データ種別に関する情報」として検出される", () => {
    sessionStorage.setItem(
      "metadata_臨床情報",
      JSON.stringify({
        databaseDataProductReadMe: "更新されたデータ種別概要",
        startYear: "2024",
        latestYear: "2028",
        notesText: "新しい留意事項",
        tables: [
          {
            id: "disease",
            physicalName: "condtion_table",
            logicalName: "傷病（変更）",
            overview: "概要更新",
            unit: "患者",
          },
          {
            id: "new_table",
            physicalName: "new_table_phys",
            logicalName: "新規テーブル",
            overview: "新しいテーブル",
            unit: "件",
          },
        ],
      }),
    );

    const changes = getMetadataChanges();
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "臨床情報",
          field: "データ種別に関する情報",
          text: "データ種別に関する情報を編集しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "収集開始年度",
          text: "収集開始年度を「2020」から「2024」へ変更しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "最新の提供可能年度",
          text: "最新の提供可能年度を「2026」から「2028」へ変更しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "留意事項",
          text: "留意事項を編集しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "テーブル情報（傷病（変更））",
          text: "テーブル情報（傷病（変更））を変更しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "テーブル一覧",
          text: "テーブル一覧に「新規テーブル」を追加しました",
        }),
        expect.objectContaining({
          category: "臨床情報",
          field: "テーブル一覧",
          text: "テーブル一覧から「薬剤・その他アレルギー等」を削除しました",
        }),
      ]),
    );
  });

  it("テーブル定義（カラム定義）の変更（論理名、項目説明等の編集）を一文で検出する", () => {
    const updatedRows = [...EXAMINATION_MOCK_DATA];
    updatedRows[0] = {
      ...updatedRows[0],
      logicalName: "更新されたプロファイル情報",
      description: "新しい項目説明",
    };

    sessionStorage.setItem(
      "metadata_臨床情報",
      JSON.stringify({
        tableDefs: {
          condtion_table: updatedRows,
        },
      }),
    );

    const changes = getMetadataChanges();
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "臨床情報",
          field: "テーブル定義（傷病）",
          text: "テーブル定義（傷病）のカラム定義を編集しました",
        }),
      ]),
    );
  });

  it("新規データ種別を追加し、初期状態のテンプレートが保存されていても誤検知されず、重複も発生しない", () => {
    sessionStorage.setItem(
      "metadata_top",
      JSON.stringify({
        databaseDataProductReadMe: "トップ概要変更",
        datatypeDataProductNames: [
          { identifiler: "臨床情報", name: "臨床情報" },
          { identifiler: "new-type-12345", name: "1234" },
        ],
      }),
    );
    // 初期テンプレートのまま保存された子データ種別
    sessionStorage.setItem(
      "metadata_1234",
      JSON.stringify({
        databaseDataProductReadMe: CHILD_OVERVIEW_TEMPLATE,
      }),
    );
    // 一時IDの重複キーが残っていた場合
    sessionStorage.setItem(
      "metadata_new-type-12345",
      JSON.stringify({
        databaseDataProductReadMe: CHILD_OVERVIEW_TEMPLATE,
      }),
    );
    // 臨床情報側でテーブル「感染症・検査」のみ削除（他2つは初期データのまま）
    sessionStorage.setItem(
      "metadata_臨床情報",
      JSON.stringify({
        tables: [
          {
            id: "disease",
            physicalName: "condtion_table",
            logicalName: "傷病",
            overview:
              "患者の傷病履歴を管理するテーブル。受診時の診断名やICD-10コード、発症日などを保持します。",
            unit: "レセプト",
          },
          {
            id: "allergy",
            physicalName: "allergyIntolerance_table",
            logicalName: "薬剤・その他アレルギー等",
            overview:
              "患者のアレルギー情報（薬剤アレルギー、食物アレルギー等）を管理するテーブル。アレルゲンや重症度などを保持します。",
            unit: "レセプト",
          },
        ],
      }),
    );

    const changes = getMetadataChanges();

    // 「データ種別に関する情報を編集しました」が誤検知・重複して含まれていないこと
    const overviewChanges = changes.filter((c) =>
      c.text.includes("データ種別に関する情報"),
    );
    expect(overviewChanges).toHaveLength(0);

    // トップの概要編集、データ種別「1234」の追加、テーブル削除のみが検出されること
    expect(changes).toEqual([
      expect.objectContaining({
        category: "トップ",
        field: "データベース全体に関する情報",
        text: "データベース全体に関する情報を編集しました",
      }),
      expect.objectContaining({
        category: "トップ",
        field: "データ種別",
        text: "データ種別「1234」を追加しました",
      }),
      expect.objectContaining({
        category: "臨床情報",
        field: "テーブル一覧",
        text: "テーブル一覧から「感染症・検査」を削除しました",
      }),
    ]);
  });
});
