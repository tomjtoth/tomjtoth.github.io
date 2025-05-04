class Character {
  // Attributes
  Strength = 40;
  Endurance = 40;
  Speed = 40;
  Agility = 40;
  Personality = 40;
  Intelligence = 40;
  Willpower = 40;
  Luck = 50;

  // Combat
  Armorer = 5;
  Athletics = 5;
  Blade = 5;
  Block = 5;
  Blunt = 5;
  Hand_to_Hand = 5;
  Heavy_Armor = 5;

  // Magic
  Alchemy = 5;
  Alteration = 5;
  Conjuration = 5;
  Destruction = 5;
  Illusion = 5;
  Mysticism = 5;
  Restoration = 5;

  // Stealth
  Acrobatics = 5;
  Light_Armor = 5;
  Marksman = 5;
  Mercantile = 5;
  Security = 5;
  Sneak = 5;
  Speechcraft = 5;

  Magicka_bonus = 0;

  progress: string[] = [];

  // constructor(racials: string, cls: string, bs: string) {
  //   this.progress.push(racials, cls, bs);
  // }

  get health() {
    return 0;

    // WiP: https://en.uesp.net/wiki/Oblivion:Endurance#Health_Gains
    // return this.Endurance * 2;
  }

  get fatigue() {
    return this.Endurance + this.Strength + this.Agility + this.Willpower;
  }

  get magicka() {
    return this.Intelligence * 2 + this.Magicka_bonus;
  }
}

export class AltmerM extends Character {
  constructor() {
    super();

    this.Strength -= 10;
    this.Speed -= 10;
    this.Intelligence += 10;

    this.Magicka_bonus += 100;

    this.Alchemy += 5;
    this.Alteration += 10;
    this.Conjuration += 5;
    this.Destruction += 10;
    this.Illusion += 5;
    this.Mysticism += 10;
  }
}
