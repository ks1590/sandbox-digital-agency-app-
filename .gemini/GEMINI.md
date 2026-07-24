# 概要
Next.js(App Router)+React19フロントエンド。AWS S3静的ホスティング(Static HTML Export)。UI:デジタル庁デザインシステム。

# 制約: S3静的ホスティング
`output: 'export'`前提。動的サーバー機能は一切使用不可(Vercel等他のスキルより優先)。
- 禁止: API Routes, Server Actions, SSR, `next/headers`, Middleware, `next/image`デフォルト最適化(`unoptimized: true`必須)
- 必須: `generateStaticParams`(動的ルーティング時)
- データ取得: クライアントサイド(fetch/SWR等)か静的生成のみ

# 技術スタック (代替提案不要)
- Next.js 16, React 19, TypeScript (any禁止, typescript-expert活用)
- Tailwind CSS v4 + デジタル庁デザインシステム
- Biome (ESLint/Prettier禁止)
- Vitest + RTL
- React Hook Form + Zod
- Day.js
- react-markdown, @mdxeditor/editor, remark-gfm, rehype-sanitize

# コーディング・セキュリティ規約
- コンポーネント: 状態/ブラウザAPI利用時は `"use client"`。基本はServer Component維持。
- a11y: WAI-ARIA, alt, フォーカス制御、セマンティックHTMLを最優先。
- スタイル: Tailwind(container-queries, typography活用)。
- フォーム: RHF + Zod。エラーは日本語。
- テスト: Vitest + RTL (`jest`ではなく`vi`)。
- セキュリティ: `dangerouslySetInnerHTML`禁止(必須時は`rehype-sanitize`)。外部リンクは`rel="noopener noreferrer"`。機密情報に`NEXT_PUBLIC_`を使わない。

# AI出力指示 (トークン節約)
- 丁寧な挨拶、前置き、無駄な解説は一切不要 (Be concise)。
- 必要なコードとファイルパスのみを極力短く出力すること。
- Node.jsサーバー環境に依存する解決策は提示しない。
- 日本語出力。