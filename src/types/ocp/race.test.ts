import { describe, expect, it } from "vitest";

import { AltmerM } from "./__simplified";

describe("Character", () => {
  it("can be created with name", () => {
    // const char = new CharN("myName");

    const char = new AltmerM();

    expect(char).to.deep.eq({
      Strength: 55,
      Endurance: 45,
      Speed: 40,
      Agility: 40,
      Personality: 30,
      Intelligence: 30,
      Willpower: 40,
      Luck: 50,

      Armorer: 5,
      Athletics: 5,
      Blade: 5,
      Block: 5,
      Blunt: 5,
      Hand_to_Hand: 5,
      Heavy_Armor: 5,

      Alchemy: 5,
      Alteration: 5,
      Conjuration: 5,
      Destruction: 5,
      Illusion: 5,
      Mysticism: 5,
      Restoration: 5,

      Acrobatics: 5,
      Light_Armor: 5,
      Marksman: 5,
      Mercantile: 5,
      Security: 5,
      Sneak: 5,
      Speechcraft: 5,
    });
  });
});
