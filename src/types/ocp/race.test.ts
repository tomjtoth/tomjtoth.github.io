import { describe, expect, it } from "vitest";

import { Character } from ".";

describe("Player", () => {
  it("can be created", () => {
    const c = new Character(0, 0, 0);
    expect(c).not.toBeNull();
  });
});
