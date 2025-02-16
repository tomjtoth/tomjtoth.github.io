import { describe, expect, it } from "vitest";

import { nameOf } from ".";

class Helper {
  static staticMethod() {}
  instanceMethod() {}
}

describe(nameOf(nameOf), () => {
  it("returns correct name for self", () => {
    expect(nameOf(nameOf)).toBe("function nameOf");
  });

  it("returns correct name for arrow function", () => {
    const xx = () => {};
    expect(nameOf(xx)).toBe("function xx");
  });

  it("returns 'function anonymous' for nameless arrow function", () => {
    expect(nameOf(() => {})).toBe("function anonymous");
  });

  it("returns correct name static method of class", () => {
    expect(nameOf(Helper.staticMethod)).toBe("function staticMethod");
  });

  it("returns correct name method of class instance", () => {
    const x = new Helper();
    expect(nameOf(x.instanceMethod)).toBe("function instanceMethod");
  });
});
