// const mp3Assets = import.meta.glob("../assets/runes/*.mp3", { eager: true });
// const pngAssets = import.meta.glob("../assets/runes/*.png", { eager: true });

const aam = "Aam";
const nhi = "Nhi";
const mega = "Mega";
const yok = "Yok";
const taar = "Taar";
const kaom = "Kaom";
const vitae = "Vitae";
const vista = "Vista";
const stregum = "Stregum";
const morte = "Morte";
const cosum = "Cosum";
const comunicatum = "Comunicatum";
const movis = "Movis";
const tempus = "Tempus";
const folgora = "Folgora";
const spacium = "Spacium";
const tera = "Tera";
const cetrius = "Cetrius";
const rhaa = "Rhaa";
const fridd = "Fridd";

export const runes = Object.fromEntries(
  [
    [aam, [0.2, 0.7]],
    [nhi, [0.15, 0.7]],
    [mega, [0.15, 1.0]],
    [yok, [0.2, 0.7]],
    [taar, [0.25, 0.9]],
    [kaom, [0.2, 1.05]],
    [vitae, [0.2, 1.0]],
    [vista, [0.3, 1.1]],
    [stregum, [0.1, 1.25]],
    [morte, [0.25, 1.2]],
    [cosum, [0.15, 1.2]],
    [comunicatum, [0.15, 1.65]],
    [movis, [0.3, 1.2]],
    [tempus, [0.3, 1.3]],
    [folgora, [0.15, 1.2]],
    [spacium, [0.3, 1.4]],
    [tera, [0.2, 1.0]],
    [cetrius, [0.15, 1.3]],
    [rhaa, [0.3, 0.9]],
    [fridd, [0.15, 1.5]],
  ].map(([rune, [start, stop]]) => {
    const runeLower = rune.toLowerCase();
    const mp3 = new Audio(`/arx/runes/${runeLower}.mp3`);
    mp3.preload = "auto";

    return [
      rune,
      {
        start,
        stop,
        length: Math.round((stop - start) * 1000),
        mp3,
        // mp3: mp3Assets[`../assets/runes/${runeLower}.mp3`].default,
        // png: pngAssets[`../assets/runes/${runeLower}.png`].default,
      },
    ];
  })
);

// based on https://wiki.arx-libertatis.org/Spells
export const spells = Object.fromEntries(
  [
    ["mega cheat", [0, [mega, mega, mega, aam, vitae, tera], false]],
    ["fizzle", [0, [undefined]]],
    ["activate portal", [1, [mega, spacium], false]],
    ["magic missile", [1, [aam, taar]]],
    ["night vision", [1, [mega, vista]]],
    ["douse", [1, [nhi, yok]]],
    ["ignite", [1, [aam, yok]]],
    ["armor", [2, [mega, kaom]]],
    ["harm", [2, [rhaa, vitae]]],
    ["lower armor", [2, [rhaa, kaom]]],
    ["heal", [2, [mega, vitae]]],
    ["detect trap", [2, [morte, cosum, vista]]],
    ["fireball", [3, [aam, yok, taar], false]],
    ["reveal", [3, [nhi, stregum, vista], false]],
    ["ice projection", [3, [aam, fridd, taar]]],
    ["speed", [3, [mega, movis]]],
    ["feed", [3, [aam, vitae, cosum]]],
    ["telekinesis", [4, [spacium, comunicatum]]],
    ["protection from cold", [4, [fridd, kaom]]],
    ["bless", [4, [mega, stregum, vitae]]],
    ["dispel field", [4, [nhi, spacium]]],
    ["protection from fire", [4, [yok, kaom]]],
    ["curse", [4, [rhaa, stregum, vitae]]],
    ["trap", [5, [aam, morte, cosum], false]],
    ["cure effects of poison", [5, [nhi, cetrius]]],
    ["repel undead", [5, [morte, kaom]]],
    ["levitate", [5, [mega, spacium, movis]]],
    ["poison projection", [5, [aam, cetrius, taar]]],
    ["slow down", [5, [rhaa, movis]]],
    ["disable trap", [6, [nhi, morte, cosum]]],
    ["create field", [6, [aam, kaom, spacium]]],
    ["raise dead", [6, [aam, morte, vitae]]],
    ["paralyze", [6, [nhi, movis]]],
    ["fire field", [7, [aam, yok, spacium]]],
    ["ice field", [7, [aam, fridd, spacium]]],
    ["confuse", [7, [nhi, vista]]],
    ["lightning projection", [7, [aam, folgora, taar]]],
    ["flying eye", [7, [vista, movis]]],
    ["mana drain", [8, [stregum, movis], false]],
    ["enchant object", [8, [mega, stregum, cosum]]],
    ["chaos", [8, [aam, mega, morte], false]],
    ["invisibility", [8, [nhi, vista]]],
    ["life drain", [8, [vitae, movis], false]],
    ["summon", [9, [aam, vitae, tera]]],
    ["mass paralyze", [9, [mega, nhi, movis]]],
    ["incinerate", [9, [aam, mega, yok]]],
    ["negate magic", [9, [nhi, stregum, spacium]]],
    ["mass lightning projection", [10, [aam, folgora, spacium], false]],
    ["mass incinerate", [10, [mega, aam, mega, yok]]],
    ["slow time", [10, [rhaa, tempus], false]],
    ["control demon", [10, [movis, comunicatum]]],
  ].map(([spell, [page, sequence, hasSound = true]]) => {
    const value = { page, sequence };

    // needs digging, most of the spells are OK for now
    if (hasSound === true) {
      value.mp3 = new Audio(`/arx/spells/${spell.replaceAll(" ", "-")}.mp3`);
      value.mp3.preload = "auto";
    }

    return [spell, value];
  })
);
