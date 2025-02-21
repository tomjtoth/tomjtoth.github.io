import { describe, expect, it, beforeEach } from "vitest";

import { setCookie as set, getCookie as get, nameOf } from ".";

describe(nameOf(set), () => {
  beforeEach(() => {
    // Expire all cookies before each test in DOM
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
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
