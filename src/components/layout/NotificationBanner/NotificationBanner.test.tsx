import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotificationBanner } from "./NotificationBanner";
import { NotificationBannerBody } from "./parts/Body";
import { NotificationBannerClose } from "./parts/Close";

describe("NotificationBanner", () => {
  it("指定されたプロパティで正しくレンダリングされること", () => {
    render(
      <NotificationBanner
        bannerStyle="standard"
        type="info1"
        title="テストタイトル"
      >
        <NotificationBannerBody>テスト本文</NotificationBannerBody>
      </NotificationBanner>
    );
    
    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("テスト本文")).toBeInTheDocument();
  });

  it("headingLevel が指定された場合、そのタグでレンダリングされること", () => {
    render(
      <NotificationBanner
        bannerStyle="color-chip"
        type="warning"
        title="警告タイトル"
        headingLevel="h2"
      >
        <NotificationBannerBody>警告本文</NotificationBannerBody>
      </NotificationBanner>
    );

    const heading = screen.getByRole("heading", { level: 2, name: /警告タイトル/ });
    expect(heading).toBeInTheDocument();
  });

  it("Close ボタンを含めて正しくレンダリングされること", () => {
    render(
      <NotificationBanner
        bannerStyle="standard"
        type="error"
        title="エラー"
      >
        <NotificationBannerBody>エラー発生</NotificationBannerBody>
        <NotificationBannerClose onClick={() => {}} />
      </NotificationBanner>
    );
    
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });
});
