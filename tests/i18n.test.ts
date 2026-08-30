import { describe, expect, it } from "vitest";
import { direction, isLocale, t } from "@/lib/i18n";
describe("i18n", () => {
  it("uses RTL for Persian and LTR for English", () => {
    expect(direction("fa")).toBe("rtl");
    expect(direction("en")).toBe("ltr");
  });
  it("rejects disabled locales", () => {
    expect(isLocale("az")).toBe(false);
    expect(isLocale("fa")).toBe(true);
  });
  it("has equivalent navigation keys", () => {
    expect(Object.keys(t("fa").nav)).toEqual(Object.keys(t("en").nav));
  });
});
