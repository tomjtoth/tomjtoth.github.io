import { CharN } from "./character";

enum Race {
  Altmer,
  Argonian,
  Bosmer,
  Breton,
  Dunmer,
  Imperial,
  Kahjiit,
  Nord,
  Orc,
  Redguard,
}

enum Gender {
  Male,
  Female,
}

export class CharNRG extends CharN {
  race: Race;
  gender: Gender;

  constructor(name: string, race: Race, gender: Gender) {
    super(name);
    this.race = race;
    this.gender = gender;

    switch (race) {
      case Race.Altmer:
        this.mods.push({
          _encoded: "0",

          Strength: -10,
          Intelligence: 10,
          ...(gender === Gender.Male ? { Speed: -10 } : { Endurance: -10 }),

          Alchemy: 5,
          Alteration: 10,
          Conjuration: 5,
          Destruction: 10,
          Illusion: 5,
          Mysticism: 10,
        });
        break;

      case Race.Argonian:
      case Race.Bosmer:
      case Race.Breton:
      case Race.Dunmer:
      case Race.Imperial:
      case Race.Kahjiit:
      case Race.Nord:
      case Race.Orc:
      case Race.Redguard:
        break;
    }
  }
}
