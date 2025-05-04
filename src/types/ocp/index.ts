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

enum Birthsign {
  Apprentice,
  Atronach,
  Lady,
  Lord,
  Lover,
  Mage,
  Ritual,
  Serpent,
  Shadow,
  Steed,
  Thief,
  Tower,
  Warrior,
}

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

enum Skill {
  // Combat
  Armorer,
  Athletics,
  Blade,
  Block,
  Blunt,
  Hand_to_Hand,
  Heavy_Armor,

  //
  Alchemy,
  Alteration,
  Conjuration,
  Destruction,
  Illusion,
  Mysticism,
  Restoration,

  Acrobatics,
  Light_Armor,
  Marksman,
  Mercantile,
  Security,
  Sneak,
  Speechcraft,
}

const governance: Record<Attribute, Skill[]> = {
  [Attribute.Strength]: [Skill.Blade, Skill.Blunt, Skill.Hand_to_Hand],

  [Attribute.Intelligence]: [Skill.Alchemy, Skill.Conjuration, Skill.Mysticism],

  [Attribute.Willpower]: [
    Skill.Alteration,
    Skill.Destruction,
    Skill.Restoration,
  ],

  [Attribute.Agility]: [Skill.Security, Skill.Sneak, Skill.Marksman],

  [Attribute.Speed]: [Skill.Athletics, Skill.Acrobatics, Skill.Light_Armor],

  [Attribute.Endurance]: [Skill.Armorer, Skill.Block, Skill.Heavy_Armor],

  [Attribute.Personality]: [
    Skill.Mercantile,
    Skill.Speechcraft,
    Skill.Illusion,
  ],
  [Attribute.Luck]: [],
};

enum Specialization {
  Combat,
  Magic,
  Stealth,
}

const specMap: Record<Specialization, Modifier> = {
  [Specialization.Combat]: {
    Armorer: 5,
    Athletics: 5,
    Blade: 5,
    Blunt: 5,
    Block: 5,
    Hand_to_Hand: 5,
    Heavy_Armor: 5,
  },
  [Specialization.Magic]: {
    Alchemy: 5,
    Alteration: 5,
    Conjuration: 5,
    Destruction: 5,
    Mysticism: 5,
    Illusion: 5,
    Restoration: 5,
  },
  [Specialization.Stealth]: {
    Acrobatics: 5,
    Light_Armor: 5,
    Marksman: 5,
    Mercantile: 5,
    Security: 5,
    Sneak: 5,
    Speechcraft: 5,
  },
};

type ModifierKey =
  | keyof typeof Attribute
  | keyof typeof Skill
  | "Health"
  | "Magicka"
  | "CharName"
  | "ClassName";

type Modifier = { _encoded?: string } & {
  [key in ModifierKey]?: number | string;
};

("https://images.uesp.net/4/4b/OB-class-Acrobat.jpg");
("https://images.uesp.net/0/08/OB-class-Agent.jpg");
("https://images.uesp.net/b/b4/OB-class-Archer.jpg");
("https://images.uesp.net/2/26/OB-class-Assassin.jpg");
("https://images.uesp.net/6/6d/OB-class-Barbarian.jpg");

const [CLS_WARRIOR]: Modifier[] = [
  {
    name: "Warrior",
    url: "https://images.uesp.net/a/a2/OB-class-Warrior.jpg",
    spec: Specialization.Combat,
    attr: [Attribute.Endurance, Attribute.Strength],
    skls: [
      Skill.Armorer,
      Skill.Athletics,
      Skill.Blade,
      Skill.Block,
      Skill.Blunt,
      Skill.Hand_to_Hand,
      Skill.Heavy_Armor,
    ],
  },
].map((cls) => {
  const mods = specMap[cls.spec] as Record<Attribute | Skill, number>;

  cls.skls.forEach((skl) => {
    if (skl in mods) {
      mods[skl] = 0;
    }
    mods[skl] += 20;
  });

  cls.attr.forEach((attr) => {
    mods[attr] = 5;
  });

  return {
    ClassName: cls.name,
    ...mods,
  };
});

type Class = {
  name: string;
  url: string;
  spec: Specialization;
  favoredAttributes: [Attribute, Attribute];
  majorSkills: [Skill, Skill, Skill, Skill, Skill, Skill, Skill];
};

export type Character = {
  name: string;
  race: Race;
  gender: Gender;
  bs: Birthsign;
  cls: Class;
  progress: Modifier[];

  stats: {
    attributes: {
      [key in keyof typeof Attribute]: number;
    };

    skills: {
      [key in keyof typeof Skill]: number;
    };

    magicka: number;
    health: number;
  };
};

class Player {
  mods: Modifier[] = [];

  charName = "NewPlayer";
  className = "CustomClass";

  constructor(mods: Modifier[]) {
    this.mods = mods;

    for (const mod of mods) {
      if ("CharName" in mod) {
        this.charName = mod.CharName as string;
      } else if ("ClassName" in mod) {
        this.className = mod.ClassName as string;
      }
    }
  }
}

export type State = {
  characters: Character[];
  current: number;
  loaded: boolean;
};
