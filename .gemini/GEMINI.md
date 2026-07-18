# プロジェクト概要
本プロジェクトは、Next.js (App Router), React 19を使用したフロントエンドアプリケーションです。
成果物は **AWS S3（静的ウェブサイトホスティング）** にデプロイされる「完全な静的サイト（Static HTML Export）」となります。
また、UIには **デジタル庁デザインシステム** を採用しています。

## 1. 絶対制約（S3 静的ホスティング）
`next.config.js` にて `output: 'export'` を設定してビルドされるため、Next.jsの動的なサーバー機能は一切使用不可です。Geminiは以下の機能を使用したコードを **絶対に提案・生成しないでください**。

*   **禁止機能**:
    *   API Routes (`app/api/*`) / Server Actions
    *   Server-Side Rendering (SSR) / 動的なデータフェッチ
    *   `next/headers` (cookies, headers 等の呼び出し)
    *   Middleware (`middleware.ts`)
    *   `next/image` のデフォルト画像最適化（利用する場合は `unoptimized: true` 必須）
*   **動的ルーティング**: `generateStaticParams` を必ず実装し、ビルド時にすべてのパスを生成すること。
*   **データフェッチ**: 外部データの取得は、クライアントサイド（ブラウザ上での `fetch` や SWR 等）で行うか、ビルド時の静的生成に留めること。

## 2. 技術スタックと指定ライブラリ
プロジェクトで採用している以下のライブラリに限定してコードを生成してください。代替ライブラリ（例: ESLint, Prettier, Jest, date-fns, Formikなど）の提案は不要です。

*   **フレームワーク**: Next.js 16 / React 19
*   **言語**: TypeScript (厳格な型付けを行うこと。`any` は極力禁止)
*   **スタイリング**: Tailwind CSS v4 + デジタル庁デザインシステム (`@digital-go-jp/tailwind-theme-plugin`, `@digital-go-jp/design-tokens`)
*   **Lint / Format**: Biome (ESLint / Prettier は使用不可)
*   **テスト**: Vitest + React Testing Library
*   **フォーム / バリデーション**: React Hook Form + Zod (`@hookform/resolvers/zod` を使用)
*   **日付処理**: Day.js
*   **Markdown処理**: `react-markdown`, `@mdxeditor/editor`, `remark-gfm`, `rehype-sanitize`

## 3. コーディング規約
### 3.1. コンポーネントとReact 19
*   **Server / Client Components**: 状態管理（`useState`等）、ブラウザAPI（`window`等）、イベントリスナーを使用する場合は、ファイル先頭に `"use client"` を明記すること。静的な部分は極力 Server Components を維持すること。
*   関数コンポーネント（Arrow Function）を標準とする。

### 3.2. スタイリングとUI (デジタル庁デザインシステム)
*   公共性の高いアプリケーションであることを前提とし、**アクセシビリティ（a11y）とセマンティックなHTMLの実装を最優先**すること。
*   適切な WAI-ARIA 属性、`alt` 属性、フォーカス制御を意識したコードを出力すること。
*   スタイリングは Tailwind CSS を用いて行い、コンテナクエリ (`@tailwindcss/container-queries`) やタイポグラフィ (`@tailwindcss/typography`) を適切に活用すること。

### 3.3. フォーム実装
*   入力フォームは必ず `react-hook-form` と `zod` を組み合わせて実装すること。
*   エラーメッセージは日本語で適切に定義し、アクセシブルな形で画面に表示させること。

### 3.4. テスト (Vitest)
*   テストコードは Vitest と `@testing-library/react` を前提とした構文で記述すること（`jest` オブジェクトではなく `vi` を使用する等）。

## 4. AIアシスタントへの出力指示
*   解説やコメントはすべて **自然な日本語** で出力すること。
*   コードを提案する際は、どのファイルに対する修正・追加であるか、ファイルパスを明記すること。
*   Node.js サーバー環境に依存する問題解決策は提示しないこと。