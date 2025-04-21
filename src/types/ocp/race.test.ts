import { describe, expect, it } from "vitest";

import { nameOf } from "../../utils/index";

import { Character } from ".";

describe("Player", () => {
  it("can be created", () => {
    const c = new Character(0, 0, [0, 1], [0, 1, 2, 3, 4, 5, 6], 0);
    expect(c).not.toBeNull();
  });
});
