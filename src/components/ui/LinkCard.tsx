import Link from "next/link";

/** リンクカードのプロパティ定義 */
export type LinkCardProps = {
  /** カードのタイトル */
  title: string;
  /** 遷移先URL */
  href: string;
};

/**
 * リンクカードコンポーネント
 *
 * デジタル庁サイトの「新着・更新」カードを参考にした
 * シンプルなナビゲーション用リンクカード。
 */
export default function LinkCard({ title, href }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="link-card"
      id={`link-card-${href.replace(/\//g, "-").replace(/^-/, "")}`}
    >
      <div className="link-card__body">
        <div className="link-card__content">
          <p className="link-card__title">{title}</p>
        </div>

        {/* 矢印アイコン */}
        <div className="link-card__arrow" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.162 3.077 13.14 8l-4.978 4.923L7.239 12l3.4-3.4H2.86V7.4h7.779L7.239 4Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
