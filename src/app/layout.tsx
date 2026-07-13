import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import AuthGuard from "@/components/layout/AuthGuard";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "公的DB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body
        className="min-h-screen"
        style={{ fontFamily: "var(--font-noto-sans-jp), sans-serif" }}
      >
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
