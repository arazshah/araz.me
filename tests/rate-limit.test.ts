import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";
describe("rateLimit", () => {
  it("blocks calls over the limit", () => {
    const key = `test-${crypto.randomUUID()}`;
    expect(rateLimit(key, 2).allowed).toBe(true);
    expect(rateLimit(key, 2).allowed).toBe(true);
    expect(rateLimit(key, 2).allowed).toBe(false);
  });
});
