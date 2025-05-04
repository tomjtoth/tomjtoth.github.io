import { Modifier } from "./character";

export class Birthsign {
  static modifiers: Modifier[] = [];
}

// export type TBirthsign = {
//   _enc: string;
//   mods: Modifier[];
// };

// export const BS_APPRENTICE: TBirthsign = {
//   _enc: "0",
//   mods: [{ Magicka: 100 }],
// };

export class Apprentice extends Birthsign {
  static modifiers = [{ Magicka: 100 }];
}

export class Atronach extends Birthsign {
  static modifiers = [{ Magicka: 150 }];
}

export class Lady extends Birthsign {
  static modifiers = [{ Willpower: 10, Endurance: 10 }];
}

export class Lord extends Birthsign {}

export class Lover extends Birthsign {}

export class Mage extends Birthsign {
  static modifiers = [{ Magicka: 50 }];
}

export class Ritual extends Birthsign {}

export class Serpent extends Birthsign {
  static modifiers = [{ Speed: 5 }];
}

export class Shadow extends Birthsign {
  static modifiers = [{ Sneak: 10 }];
}

export class Steed extends Birthsign {
  static modifiers = [{ Speed: 20 }];
}

export class Thief extends Birthsign {
  static modifiers = [{ Agility: 10, Luck: 10, Speed: 10 }];
}

export class Tower extends Birthsign {}

export class Warrior extends Birthsign {
  static modifiers = [{ Strength: 10, Endurance: 10 }];
}
