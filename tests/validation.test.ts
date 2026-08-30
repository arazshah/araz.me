import { describe, expect, it } from "vitest";
import { contactSchema, contentSchema, loginSchema } from "@/lib/validation";
describe("validation", () => {
  it("accepts a valid contact submission", () => {
    expect(
      contactSchema.safeParse({
        name: "Araz",
        email: "mail@araz.me",
        company: "",
        collaborationType: "consulting",
        subject: "Spatial API",
        message: "I would like to discuss a geospatial API architecture.",
        consent: "true",
        website: "",
        locale: "en",
      }).success,
    ).toBe(true);
  });
  it("rejects honeypot and short messages", () => {
    expect(
      contactSchema.safeParse({
        name: "A",
        email: "bad",
        collaborationType: "other",
        subject: "x",
        message: "spam",
        consent: "true",
        website: "bot",
        locale: "en",
      }).success,
    ).toBe(false);
  });
  it("requires strong login input", () => {
    expect(
      loginSchema.safeParse({
        email: "admin@example.com",
        password: "very-long-password",
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "admin@example.com", password: "short" })
        .success,
    ).toBe(false);
  });
  it("allows only clean slugs and known states", () => {
    expect(
      contentSchema.safeParse({
        title: "A title",
        slug: "valid-slug",
        summary: "A sufficiently detailed summary",
        body: "A sufficiently detailed body",
        locale: "fa",
        status: "DRAFT",
      }).success,
    ).toBe(true);
    expect(
      contentSchema.safeParse({
        title: "A title",
        slug: "../bad",
        summary: "A sufficiently detailed summary",
        body: "A sufficiently detailed body",
        locale: "fa",
        status: "PUBLIC",
      }).success,
    ).toBe(false);
  });
});
