# sandbox-digital-agency-app

## 1. プロジェクトの概要
当プロジェクトは、最新の **Next.js (v16.2)** と **React 19** をベースにしたWebアプリケーションです。
依存関係に `@digital-go-jp/design-tokens` や `@digital-go-jp/tailwind-theme-plugin` が含まれており、**日本のデジタル庁のデザインシステム**に準拠したUI構築を試みるためのサンドボックス（実験的アプリ）となっています。

### 主な技術スタック
* **フレームワーク**: Next.js, React
* **スタイリング**: Tailwind CSS (v4)
* **フォームとバリデーション**: React Hook Form, Zod
* **マークダウン処理**: `react-markdown`, `@mdxeditor/editor`
* **ツールチェイン**: Biome (リンター/フォーマッター), Vitest, Testing Library

---

## 2. ディレクトリ構成
主要なディレクトリおよびファイルの意味は以下の通りです。

* **`src/`**: アプリケーションのメインソースコード
  * **`src/app/`**: Next.js App Routerのルーティングおよびページコンポーネント
  * **`src/components/`**: 再利用可能なReactコンポーネント
  * **`src/actions/`**: Server Actionsなどのサーバーサイド処理
* **`design-sample/`**: デジタル庁デザインシステムなどを活用したデザインのサンプルや実装例 (`design-example`)
* **`public/`**: 静的アセット（画像、アイコンなど）
* **`.agents/`**: AIエージェントの振る舞いをカスタマイズするための設定（ルールやSkills）が格納されたワークスペースルート
* **`.next/`** / **`out/`**: Next.jsのビルド出力結果ディレクトリ
* **`node_modules/`**: インストールされた依存パッケージ
* **`package.json` / `pnpm-workspace.yaml`**: プロジェクト情報、実行スクリプト、パッケージ管理 (pnpm) の設定ファイル

---

## 3. AIエージェント用のSkills (拡張機能) について
このプロジェクトでは、AIエージェントの能力を拡張する「Skills」が `.agents/skills/` ディレクトリ配下に追加されています。ここに追加されたSkillはAIエージェントによって自動検出され、開発時のサポートに反映されます。

### Skillsの追加方法 (追加コマンド)

https://www.skills.sh/

新たなSkillを追加する際は、`npx skills add` コマンドを使用します。当プロジェクトに現在追加されているSkillは、過去に以下のコマンドを実行することで導入されました。

```bash
# Vercel公式のReact/Next.jsベストプラクティスのSkillを追加
npx skills add vercel-labs/agent-skills

# TypeScriptの専門的なサポートを行うSkillを追加
npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill typescript-expert
```

（※ 現在は `typescript-expert` と `vercel-react-best-practices` の2つのSkillが利用可能となっています。）
