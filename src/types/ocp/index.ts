enum Attribute {
  Strength,
  Intelligence,
  Willpower,
  Agility,
  Speed,
  Endurance,
  Personality,

  Luck,
}

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

enum Sex {
  Male,
  Female,
}

enum Skill {
  // Strength
  Blade,
  Blunt,
  Hand_to_Hand,

  // Endurance
  Armorer,
  Block,
  Heavy_Armor,

  // Speed
  Athletics,
  Acrobatics,
  Light_Armor,

  // Agility
  Security,
  Sneak,
  Marksman,

  // Personality
  Mercantile,
  Speechcraft,
  Illusion,

  // Intelligence
  Alchemy,
  Conjuration,
  Mysticism,

  // Willpower
  Alteration,
  Destruction,
  Restoration,
}

enum Specialization {
  Combat,
  Magic,
  Stealth,
}

type AttrModifier = {
  [key in keyof typeof Attribute]?: number;
};

type SkillModifier = {
  [key in keyof typeof Skill]?: number;
};

type Modifier = { _encoded?: number | string } & (AttrModifier | SkillModifier);

export class Character {
  // static from(qs: string) {}

  // #progress = [];
  #modifiers: Modifier[] = [];
  level = 1;

  constructor(
    race: Race,
    sex: Sex,
    // majorAttributes: Attribute[],
    // majorSkills: Skill[],
    specialization: Specialization
  ) {
    switch (race) {
      case Race.Altmer:
        this.#modifiers.push({
          _encoded: Race.Altmer,
          Alchemy: 5,
          Alteration: 10,
          Conjuration: 5,
          Destruction: 10,
          Illusion: 5,
          Mysticism: 10,
        });

        this.#modifiers.push({
          ...{ Strength: -10, Intelligence: 10 },
          ...(sex === Sex.Male ? { Speed: -10 } : { Endurance: -10 }),
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

    switch (specialization) {
      case Specialization.Combat:
        this.#modifiers.push({
          Blade: 5,
          Blunt: 5,
          Hand_to_Hand: 5,
          Armorer: 5,
          Block: 5,
          Heavy_Armor: 5,
          Athletics: 5,
        });
        break;

      case Specialization.Magic:
        this.#modifiers.push({
          Illusion: 5,
          Alchemy: 5,
          Conjuration: 5,
          Mysticism: 5,
          Alteration: 5,
          Destruction: 5,
          Restoration: 5,
        });
        break;

      case Specialization.Stealth:
        this.#modifiers.push({
          Acrobatics: 5,
          Light_Armor: 5,
          Security: 5,
          Sneak: 5,
          Marksman: 5,
          Mercantile: 5,
          Speechcraft: 5,
        });
        break;
    }
  }

  get health() {
    return 0;
  }

  get toUrl() {
    return [].join(";");
  }
}
