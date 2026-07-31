import { describe, expect, it } from "vitest";
import {
  formatSize,
  isFileTypeAllowed,
  parseAcceptAttribute,
  parseSize,
} from "./index";

describe("FileUpload utils", () => {
  describe("formatSize", () => {
    it("0バイトの場合は'0B'を返すこと", () => {
      expect(formatSize(0)).toBe("0B");
    });

    it("1KB未満の場合はBでフォーマットされること", () => {
      expect(formatSize(512)).toBe("512B");
    });

    it("KBで正しくフォーマットされること", () => {
      expect(formatSize(1024)).toBe("1KB");
      expect(formatSize(1500)).toBe("1.5KB");
    });

    it("MBで正しくフォーマットされること", () => {
      expect(formatSize(1024 * 1024)).toBe("1MB");
      expect(formatSize(1.5 * 1024 * 1024)).toBe("1.5MB");
    });

    it("GBで正しくフォーマットされること", () => {
      expect(formatSize(1024 * 1024 * 1024)).toBe("1GB");
    });

    it("precisionが指定された場合、その桁数でフォーマットされること", () => {
      expect(formatSize(1500, 2)).toBe("1.46KB");
      expect(formatSize(1500, 0)).toBe("1KB");
    });
  });

  describe("isFileTypeAllowed", () => {
    it("許可された拡張子の場合はtrueを返すこと", () => {
      expect(isFileTypeAllowed("test.pdf", "application/pdf", [".pdf"])).toBe(
        true,
      );
    });

    it("許可されていない拡張子の場合はfalseを返すこと", () => {
      expect(isFileTypeAllowed("test.txt", "text/plain", [".pdf"])).toBe(false);
    });

    it("許可されたMIMEタイプの場合はtrueを返すこと", () => {
      expect(isFileTypeAllowed("test.csv", "text/csv", ["text/csv"])).toBe(
        true,
      );
    });

    it("許可されていないMIMEタイプの場合はfalseを返すこと", () => {
      expect(
        isFileTypeAllowed("test.csv", "text/csv", ["application/json"]),
      ).toBe(false);
    });

    it("ワイルドカードのMIMEタイプ（例: image/*）の場合、先頭が一致すればtrueを返すこと", () => {
      expect(isFileTypeAllowed("test.png", "image/png", ["image/*"])).toBe(
        true,
      );
      expect(isFileTypeAllowed("test.jpg", "image/jpeg", ["image/*"])).toBe(
        true,
      );
      expect(
        isFileTypeAllowed("test.pdf", "application/pdf", ["image/*"]),
      ).toBe(false);
    });
  });

  describe("parseAcceptAttribute", () => {
    it("カンマ区切りの文字列を配列に変換し、前後の空白をトリムすること", () => {
      expect(parseAcceptAttribute(".pdf, .doc, image/*")).toEqual([
        ".pdf",
        ".doc",
        "image/*",
      ]);
    });

    it("小文字に変換されること", () => {
      expect(parseAcceptAttribute(".PDF, .DOC")).toEqual([".pdf", ".doc"]);
    });

    it("空文字やnullの場合は空配列を返すこと", () => {
      expect(parseAcceptAttribute("")).toEqual([]);
      expect(parseAcceptAttribute(undefined as unknown as string)).toEqual([]);
    });
  });

  describe("parseSize", () => {
    it("KB/MB/GBの文字列をバイト単位の数値に変換すること", () => {
      expect(parseSize("1kb")).toBe(1024);
      expect(parseSize("1.5mb")).toBe(1.5 * 1024 * 1024);
      expect(parseSize("2gb")).toBe(2 * 1024 * 1024 * 1024);
      expect(parseSize("500b")).toBe(500);
      expect(parseSize("500")).toBe(500);
    });

    it("大文字小文字を区別しないこと", () => {
      expect(parseSize("1KB")).toBe(1024);
      expect(parseSize("1Mb")).toBe(1024 * 1024);
    });

    it("空白が含まれていても正しくパースされること", () => {
      expect(parseSize("1 mb")).toBe(1024 * 1024);
    });

    it("不正な文字列や空の場合はnullを返すこと", () => {
      expect(parseSize(null)).toBe(null);
      expect(parseSize("")).toBe(null);
      expect(parseSize("invalid")).toBe(null);
    });
  });
});
