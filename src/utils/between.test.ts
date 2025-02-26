import { describe, expect, it } from "vitest";

import { between as fn, nameOf } from ".";

describe(nameOf(fn), () => {
  it("2 is between 1 and 3", () => {
    expect(fn(2, 1, 3)).toBe(true);
  });

  it("2 is between 2 and 3", () => {
    expect(fn(2, 2, 3)).toBe(true);
  });

  it("2 is not between 3 and 1", () => {
    expect(fn(2, 3, 1)).toBe(false);
  });

  it("-2 is between -3 and -1", () => {
    expect(fn(-2, -3, -1)).toBe(true);
  });

  it("-2 is not between -1 and -3", () => {
    expect(fn(-2, -1, -3)).toBe(false);
  });
});
