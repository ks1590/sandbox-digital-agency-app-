# sandbox-digital-agency-app

デジタル庁デザインシステムに準拠したUI実装および機能検証を行うための Next.js 開発用サンドボックスアプリケーションです。

## 1. プロジェクト概要

当プロジェクトは、最新の **Next.js (v16.2)** と **React 19** をベースにしたWebアプリケーションです。  
デジタル庁のデザインシステムパッケージ (`@digital-go-jp/design-tokens` および `@digital-go-jp/tailwind-theme-plugin`) を導入し、行政・医療関連データの管理画面やポータルUIの構築パターンを検証・開発することを目的としています。

---

## 2. 機能要件 (主要機能)

ログインしているユーザー（ロール）に応じて、ポータル画面からアクセス可能な機能が制御されます。

* **ログイン機能 (`/login`)**
  * ユーザーIDによる疑似ログインおよびローカルストレージ (`login-user-id`) での状態保持。
  * ユーザーごとのメニュー表示制御（例: `test-userA`, `test-userB` 等）。
* **月次抽出依頼検索 (`/extraction-status`)** (対象ユーザー: `test-userA`)
  * データ抽出依頼のステータス一覧参照、検索、フィルタリングおよび詳細表示。
* **メタデータ参照・登録 (`/metadata`)** (対象ユーザー: `test-userB`)
  * 医療情報・臨床情報等のメタデータ一覧の閲覧・詳細表示・新規登録・編集。
  * テーブル定義参照 (`/metadata/table-def`) や概要テンプレート（`CHILD_OVERVIEW_TEMPLATE` 等）の適用。
  * Zod + React Hook Form による入力バリデーション。
* **データプロファイル参照 (`/data-profile`)** (対象ユーザー: `test-userB`)
  * 各種データプロファイルの参照および分析情報の表示。

---

## 3. 主な技術スタック

* **フレームワーク**: Next.js (App Router v16.2), React 19, TypeScript
* **UI / スタイリング**: Tailwind CSS (v4), `@digital-go-jp/design-tokens`, `@digital-go-jp/tailwind-theme-plugin`
* **フォーム / バリデーション**: React Hook Form, Zod
* **リッチテキスト / マークダウン**: `react-markdown`, `@mdxeditor/editor`, `remark-gfm`, `rehype-sanitize`
* **コード品質・ツールチェーン**: Biome (Linter / Formatter)
* **テスト**: Vitest, React Testing Library, Testing Library Jest DOM

---

## 4. セットアップ手順

### 前提条件 (Prerequisites)
* **Node.js**: `v20.x` 以上推奨
* **パッケージマネージャー**: `pnpm` 推奨 (`npm` や `yarn` も利用可能)

### パッケージのインストール
リポジトリルートで以下のコマンドを実行し、依存パッケージをインストールします。

```bash
pnpm install
```

---

## 5. 起動・実行方法

### 開発用サーバーの起動
開発モードでローカルサーバーを起動します。

```bash
pnpm dev
```
起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### プロダクションビルドと起動
プロダクション環境用のビルドを作成し、実行します。

```bash
# ビルドの実行
pnpm build

# プロダクションサーバーの起動
pnpm start
```

### コードチェック・フォーマット (Biome)
```bash
# リンターによるコードチェック
pnpm lint

# 自動フォーマットの実行
pnpm format
```

### テストの実行 (Vitest)
```bash
# テストの実行 (ウォッチモード)
pnpm test

# テストの一括実行 (CI向け)
pnpm test:run

# カバレッジの計測
pnpm test:coverage
```

---

## 6. ディレクトリ構成

```text
.
├── .agents/              # AIエージェント設定・カスタムSkills
├── public/               # 静的アセットファイル
├── src/
│   ├── app/              # Next.js App Router ページ・ルーティング
│   │   ├── data-profile/ # データプロファイル参照画面
│   │   ├── extraction-status/ # 月次抽出依頼検索画面
│   │   ├── login/        # ログイン画面
│   │   ├── metadata/     # メタデータ参照・登録・編集画面
│   │   ├── globals.css   # グローバルスタイル (Tailwind CSS設定)
│   │   ├── layout.tsx    # ルートレイアウト
│   │   └── page.tsx      # ポータル画面 (メインメニュー)
│   └── components/       # 共通コンポーネント (UI, Layout等)
├── biome.json            # Biome 設定ファイル
├── next.config.ts        # Next.js 設定ファイル
├── package.json          # 依存パッケージ・スクリプト定義
├── tsconfig.json         # TypeScript 設定ファイル
└── vitest.config.ts      # Vitest 設定ファイル
```

---

## 7. AIエージェント用 Skills について

このプロジェクトでは、AIエージェントの能力を拡張する「Skills」が `.agents/skills/` ディレクトリ配下に設定されています。

### 利用可能な Skills
* `typescript-expert`: TypeScriptの型プログラミングやパフォーマンス最適化に関する専門知識
* `vercel-react-best-practices`: Vercel公式による React / Next.js のパフォーマンス最適化ガイドライン
