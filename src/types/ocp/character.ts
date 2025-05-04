import { Attribute } from "./attributes";
import { Skill } from "./skills";

export type ModKey = keyof typeof Attribute | keyof typeof Skill | "Magicka";

export type Modifier = { _encoded?: string } & {
  [key in ModKey]?: number;
};

export class CharN {
  mods: Modifier[] = [];
  #getterBuffer: Record<string, number> = {};
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get(key: ModKey) {
    if (key in this.#getterBuffer) {
      return this.#getterBuffer[key];
    }

    const base = key === "Luck" ? 50 : key in Attribute ? 40 : 5;
    const sum = this.mods.reduce(
      (sum, mod) => sum + (mod[key as ModKey] ?? 0),
      base
    );

    this.#getterBuffer[key] = sum;

    return sum;
  }

  inc(sk: Skill) {}
}
