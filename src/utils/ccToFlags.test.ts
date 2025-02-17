import { describe, expect, it } from "vitest";

import { ccToFlags as fn, nameOf } from ".";

describe(nameOf(fn), () => {
  it("replaces single occurence", () => {
    expect(fn("::FI")).toBe("🇫🇮");
  });

  it("removes markups with invalid country code", () => {
    expect(fn("::FI asdf ::QQ")).toBe("🇫🇮 asdf ");
  });

  it("replaces multiple occurences correctly", () => {
    expect(fn("11 ::HU 22 ::FI ")).toBe("11 🇭🇺 22 🇫🇮 ");
  });

  it("requires a space|start on the left", () => {
    expect(fn("11 ::HU 22 ::FI 33::FR")).toBe("11 🇭🇺 22 🇫🇮 33::FR");
  });
});
