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
  rune: RE;
  start: number;
  stop: number;
  length: number;
  mp3: HTMLAudioElement;
};

export const RUNES = [
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
].map(([rune, start, stop]) => {
  const strLower = RE[rune].toLowerCase();
  const mp3 = new Audio(`/arx/runes/${strLower}.mp3`);
  mp3.preload = "auto";

  return {
    rune,
    start,
    stop,
    length: Math.round((stop - start) * 1000),
    mp3,
  } as Rune;
});
