export enum Skill {
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

export class CSkill {
  static sym: string;
  static dump = () => this.sym;
  static read = () => Alteration;
}

export class Alteration extends CSkill {
  static sym = "x";
}
