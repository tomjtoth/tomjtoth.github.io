import { describe, expect, it } from "vitest";

import { setCookie as set, getCookie as get, nameOf } from ".";

let cookies = {};

// Mock the global document object if it doesn't exist
if (typeof global.document === "undefined") {
  global.document = {};

  Object.defineProperty(global.document, "cookie", {
    get: () => {
      return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");
    },
    set: (cookie) => {
      const eqIdx = cookie.indexOf("=");
      const key = cookie.substring(0, eqIdx);
      const val = cookie.substring(eqIdx + 1);
      cookies[key] = val;
    },
    configurable: true,
  });
}

describe(nameOf(set), () => {
  beforeEach(() => {
    cookies = {};
  });

  it("setting and getting the same cookie works", () => {
    set("omena", 666);

    expect(get("omena")).toBe("666");
  });

  it("setting and getting keys/values with encodables work", () => {
    const key = " éáű  ;;";
    const val = " _ _ _ ";
    set(key, val);

    expect(get(key)).toBe(val);
  });

  it("getting uninintialized cookie returns null", () => {
    expect(get("omena")).toBeNull();
  });

  it("setting and getting the same cookie works", () => {
    set("qqq", 333);
    set("www", 555);
    set("omena", 666);

    expect(get("omena")).toBe("666");
  });
});
