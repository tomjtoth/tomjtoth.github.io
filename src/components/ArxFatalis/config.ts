// const mp3Assets = import.meta.glob("../assets/runes/*.mp3", { eager: true });
// const pngAssets = import.meta.glob("../assets/runes/*.png", { eager: true });

export enum RE {
  Aam,
  Nhi,
  Mega,
  Yok,
  Taar,
  Kaom,
  Vitae,
  Vista,
  Stregum,
  Morte,
  Cosum,
  Comunicatum,
  Movis,
  Tempus,
  Folgora,
  Spacium,
  Tera,
  Cetrius,
  Rhaa,
  Fridd,
}

type Rune = {
  rune: string;
  start: number;
  stop: number;
  length: number;
  mp3: HTMLAudioElement;
};

export const runes = [
  [RE.Aam, 0.2, 0.7],
  [RE.Nhi, 0.15, 0.7],
  [RE.Mega, 0.15, 1.0],
  [RE.Yok, 0.2, 0.7],
  [RE.Taar, 0.25, 0.9],
  [RE.Kaom, 0.2, 1.05],
  [RE.Vitae, 0.2, 1.0],
  [RE.Vista, 0.3, 1.1],
  [RE.Stregum, 0.1, 1.25],
  [RE.Morte, 0.25, 1.2],
  [RE.Cosum, 0.15, 1.2],
  [RE.Comunicatum, 0.15, 1.65],
  [RE.Movis, 0.3, 1.2],
  [RE.Tempus, 0.3, 1.3],
  [RE.Folgora, 0.15, 1.2],
  [RE.Spacium, 0.3, 1.4],
  [RE.Tera, 0.2, 1.0],
  [RE.Cetrius, 0.15, 1.3],
  [RE.Rhaa, 0.3, 0.9],
  [RE.Fridd, 0.15, 1.5],
].map(([re, start, stop]) => {
  const rune = RE[re];
  const runeLower = rune.toLowerCase();
  const mp3 = new Audio(`/arx/runes/${runeLower}.mp3`);
  mp3.preload = "auto";

  return {
    rune,
    start,
    stop,
    length: Math.round((stop - start) * 1000),
    mp3,
    // mp3: mp3Assets[`../assets/runes/${runeLower}.mp3`].default,
    // png: pngAssets[`../assets/runes/${runeLower}.png`].default,
  } as Rune;
});

type Spell = {
  spell: string;
  page: number;
  sequence: RE[];
  mp3?: HTMLAudioElement;
};

export const fizzle = new Audio("/arx/spells/fizzle.mp3");
fizzle.preload = "auto";

// based on https://wiki.arx-libertatis.org/Spells
export const spells = [
  [
    "mega cheat",
    [0, [RE.Mega, RE.Mega, RE.Mega, RE.Aam, RE.Vitae, RE.Tera], false],
  ],
  ["fizzle", [0, []]],
  ["activate portal", [1, [RE.Mega, RE.Spacium], false]],
  ["magic missile", [1, [RE.Aam, RE.Taar]]],
  ["night vision", [1, [RE.Mega, RE.Vista]]],
  ["douse", [1, [RE.Nhi, RE.Yok]]],
  ["ignite", [1, [RE.Aam, RE.Yok]]],
  ["armor", [2, [RE.Mega, RE.Kaom]]],
  ["harm", [2, [RE.Rhaa, RE.Vitae]]],
  ["lower armor", [2, [RE.Rhaa, RE.Kaom]]],
  ["heal", [2, [RE.Mega, RE.Vitae]]],
  ["detect trap", [2, [RE.Morte, RE.Cosum, RE.Vista]]],
  ["fireball", [3, [RE.Aam, RE.Yok, RE.Taar], false]],
  ["reveal", [3, [RE.Nhi, RE.Stregum, RE.Vista], false]],
  ["ice projection", [3, [RE.Aam, RE.Fridd, RE.Taar]]],
  ["speed", [3, [RE.Mega, RE.Movis]]],
  ["feed", [3, [RE.Aam, RE.Vitae, RE.Cosum]]],
  ["telekinesis", [4, [RE.Spacium, RE.Comunicatum]]],
  ["protection from cold", [4, [RE.Fridd, RE.Kaom]]],
  ["bless", [4, [RE.Mega, RE.Stregum, RE.Vitae]]],
  ["dispel field", [4, [RE.Nhi, RE.Spacium]]],
  ["protection from fire", [4, [RE.Yok, RE.Kaom]]],
  ["curse", [4, [RE.Rhaa, RE.Stregum, RE.Vitae]]],
  ["trap", [5, [RE.Aam, RE.Morte, RE.Cosum], false]],
  ["cure effects of poison", [5, [RE.Nhi, RE.Cetrius]]],
  ["repel undead", [5, [RE.Morte, RE.Kaom]]],
  ["levitate", [5, [RE.Mega, RE.Spacium, RE.Movis]]],
  ["poison projection", [5, [RE.Aam, RE.Cetrius, RE.Taar]]],
  ["slow down", [5, [RE.Rhaa, RE.Movis]]],
  ["disable trap", [6, [RE.Nhi, RE.Morte, RE.Cosum]]],
  ["create field", [6, [RE.Aam, RE.Kaom, RE.Spacium]]],
  ["raise dead", [6, [RE.Aam, RE.Morte, RE.Vitae]]],
  ["paralyze", [6, [RE.Nhi, RE.Movis]]],
  ["fire field", [7, [RE.Aam, RE.Yok, RE.Spacium]]],
  ["ice field", [7, [RE.Aam, RE.Fridd, RE.Spacium]]],
  ["confuse", [7, [RE.Nhi, RE.Vista]]],
  ["lightning projection", [7, [RE.Aam, RE.Folgora, RE.Taar]]],
  ["flying eye", [7, [RE.Vista, RE.Movis]]],
  ["mana drain", [8, [RE.Stregum, RE.Movis], false]],
  ["enchant object", [8, [RE.Mega, RE.Stregum, RE.Cosum]]],
  ["chaos", [8, [RE.Aam, RE.Mega, RE.Morte], false]],
  ["invisibility", [8, [RE.Nhi, RE.Vista]]],
  ["life drain", [8, [RE.Vitae, RE.Movis], false]],
  ["summon", [9, [RE.Aam, RE.Vitae, RE.Tera]]],
  ["mass paralyze", [9, [RE.Mega, RE.Nhi, RE.Movis]]],
  ["incinerate", [9, [RE.Aam, RE.Mega, RE.Yok]]],
  ["negate magic", [9, [RE.Nhi, RE.Stregum, RE.Spacium]]],
  ["mass lightning projection", [10, [RE.Aam, RE.Folgora, RE.Spacium], false]],
  ["mass incinerate", [10, [RE.Mega, RE.Aam, RE.Mega, RE.Yok]]],
  ["slow time", [10, [RE.Rhaa, RE.Tempus], false]],
  ["control demon", [10, [RE.Movis, RE.Comunicatum]]],
].map(([spell, [page, sequence, hasSound = true]]) => {
  const value = { page, sequence } as {
    page: number;
    sequence: RE[];
    mp3?: HTMLAudioElement;
  };

  // needs digging, most of the spells are OK for now
  if (hasSound === true) {
    value.mp3 = new Audio(
      `/arx/spells/${(spell as string).replaceAll(" ", "-")}.mp3`
    );
    value.mp3.preload = "auto";
  }

  return { spell, ...value } as Spell;
});
