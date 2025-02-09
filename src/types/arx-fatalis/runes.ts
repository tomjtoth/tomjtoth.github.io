export enum RE {
  aam,
  nhi,
  mega,
  yok,
  taar,
  kaom,
  vitae,
  vista,
  stregum,
  morte,
  cosum,
  comunicatum,
  movis,
  tempus,
  folgora,
  spacium,
  tera,
  cetrius,
  rhaa,
  fridd,
}

export class Rune {
  static arr: Rune[] = (() => {
    console.debug("initializing Runes audio");

    return [
      [RE.aam, 0.2, 0.7],
      [RE.nhi, 0.15, 0.7],
      [RE.mega, 0.15, 1.0],
      [RE.yok, 0.2, 0.7],
      [RE.taar, 0.25, 0.9],
      [RE.kaom, 0.2, 1.05],
      [RE.vitae, 0.2, 1.0],
      [RE.vista, 0.3, 1.1],
      [RE.stregum, 0.1, 1.25],
      [RE.morte, 0.25, 1.2],
      [RE.cosum, 0.15, 1.2],
      [RE.comunicatum, 0.15, 1.65],
      [RE.movis, 0.3, 1.2],
      [RE.tempus, 0.3, 1.3],
      [RE.folgora, 0.15, 1.2],
      [RE.spacium, 0.3, 1.4],
      [RE.tera, 0.2, 1.0],
      [RE.cetrius, 0.15, 1.3],
      [RE.rhaa, 0.3, 0.9],
      [RE.fridd, 0.15, 1.5],
    ].map((row: any) => new Rune(row));
  })();

  static byVariant(variant: RE) {
    return this.arr.find((x) => x.variant === variant);
  }

  variant: RE;
  private startsAt: number;
  private length: number;
  mp3: HTMLAudioElement;

  constructor([rune, start, stop]: [RE, number, number]) {
    this.variant = rune;
    const path = this.url("mp3");
    this.mp3 = new Audio(path);
    this.mp3.preload = "auto";
    this.startsAt = start;
    this.length = Math.round((stop - start) * 1000);
  }

  play() {
    console.debug(`playing ${this.str(false)}`);
    this.mp3.currentTime = this.startsAt;
    this.mp3.play();
    return this.length;
  }

  str(titleCase = true) {
    const name = RE[this.variant];

    if (titleCase) {
      const [initial, ...rest] = name;
      return [initial.toUpperCase(), ...rest].join("");
    }

    return name;
  }

  private url(ext = "mp3") {
    return `/arx/runes/${this.str(false)}.${ext}`;
  }

  png() {
    return this.url("png");
  }
}
