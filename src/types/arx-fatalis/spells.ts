import { RuneEnum as RE, Rune } from ".";

export enum SpellEnum {
  megaCheat,
  fizzle,
  activatePortal,
  magicMissile,
  nightVision,
  douse,
  ignite,
  armor,
  harm,
  lowerArmor,
  heal,
  detectTrap,
  fireball,
  reveal,
  iceProjection,
  speed,
  feed,
  telekinesis,
  protectionFromCold,
  bless,
  dispelField,
  protectionFromFire,
  curse,
  trap,
  cureEffectsOfPoison,
  repelUndead,
  levitate,
  poisonProjection,
  slowDown,
  disableTrap,
  createField,
  raiseDead,
  paralyze,
  fireField,
  iceField,
  confuse,
  lightningProjection,
  flyingEye,
  manaDrain,
  enchantObject,
  chaos,
  invisibility,
  lifeDrain,
  summon,
  massParalyze,
  incinerate,
  negateMagic,
  massLightningProjection,
  massIncinerate,
  slowTime,
  controlDemon,
}

const SE = SpellEnum;

export class Spell {
  // based on https://wiki.arx-libertatis.org/Spells
  static #spells: Spell[] = (() => {
    console.debug("initializing Spells audio");

    return [
      [
        SE.megaCheat,
        [0, [RE.mega, RE.mega, RE.mega, RE.aam, RE.vitae, RE.tera], false],
      ],
      [SE.fizzle, [0, []]],
      [SE.activatePortal, [1, [RE.mega, RE.spacium], false]],
      [SE.magicMissile, [1, [RE.aam, RE.taar]]],
      [SE.nightVision, [1, [RE.mega, RE.vista]]],
      [SE.douse, [1, [RE.nhi, RE.yok]]],
      [SE.ignite, [1, [RE.aam, RE.yok]]],
      [SE.armor, [2, [RE.mega, RE.kaom]]],
      [SE.harm, [2, [RE.rhaa, RE.vitae]]],
      [SE.lowerArmor, [2, [RE.rhaa, RE.kaom]]],
      [SE.heal, [2, [RE.mega, RE.vitae]]],
      [SE.detectTrap, [2, [RE.morte, RE.cosum, RE.vista]]],
      [SE.fireball, [3, [RE.aam, RE.yok, RE.taar], false]],
      [SE.reveal, [3, [RE.nhi, RE.stregum, RE.vista], false]],
      [SE.iceProjection, [3, [RE.aam, RE.fridd, RE.taar]]],
      [SE.speed, [3, [RE.mega, RE.movis]]],
      [SE.feed, [3, [RE.aam, RE.vitae, RE.cosum]]],
      [SE.telekinesis, [4, [RE.spacium, RE.comunicatum]]],
      [SE.protectionFromCold, [4, [RE.fridd, RE.kaom]]],
      [SE.bless, [4, [RE.mega, RE.stregum, RE.vitae]]],
      [SE.dispelField, [4, [RE.nhi, RE.spacium]]],
      [SE.protectionFromFire, [4, [RE.yok, RE.kaom]]],
      [SE.curse, [4, [RE.rhaa, RE.stregum, RE.vitae]]],
      [SE.trap, [5, [RE.aam, RE.morte, RE.cosum], false]],
      [SE.cureEffectsOfPoison, [5, [RE.nhi, RE.cetrius]]],
      [SE.repelUndead, [5, [RE.morte, RE.kaom]]],
      [SE.levitate, [5, [RE.mega, RE.spacium, RE.movis]]],
      [SE.poisonProjection, [5, [RE.aam, RE.cetrius, RE.taar]]],
      [SE.slowDown, [5, [RE.rhaa, RE.movis]]],
      [SE.disableTrap, [6, [RE.nhi, RE.morte, RE.cosum]]],
      [SE.createField, [6, [RE.aam, RE.kaom, RE.spacium]]],
      [SE.raiseDead, [6, [RE.aam, RE.morte, RE.vitae]]],
      [SE.paralyze, [6, [RE.nhi, RE.movis]]],
      [SE.fireField, [7, [RE.aam, RE.yok, RE.spacium]]],
      [SE.iceField, [7, [RE.aam, RE.fridd, RE.spacium]]],
      [SE.confuse, [7, [RE.nhi, RE.vista]]],
      [SE.lightningProjection, [7, [RE.aam, RE.folgora, RE.taar]]],
      [SE.flyingEye, [7, [RE.vista, RE.movis]]],
      [SE.manaDrain, [8, [RE.stregum, RE.movis], false]],
      [SE.enchantObject, [8, [RE.mega, RE.stregum, RE.cosum]]],
      [SE.chaos, [8, [RE.aam, RE.mega, RE.morte], false]],
      [SE.invisibility, [8, [RE.nhi, RE.vista]]],
      [SE.lifeDrain, [8, [RE.vitae, RE.movis], false]],
      [SE.summon, [9, [RE.aam, RE.vitae, RE.tera]]],
      [SE.massParalyze, [9, [RE.mega, RE.nhi, RE.movis]]],
      [SE.incinerate, [9, [RE.aam, RE.mega, RE.yok]]],
      [SE.negateMagic, [9, [RE.nhi, RE.stregum, RE.spacium]]],
      [
        SE.massLightningProjection,
        [10, [RE.aam, RE.folgora, RE.spacium], false],
      ],
      [SE.massIncinerate, [10, [RE.mega, RE.aam, RE.mega, RE.yok]]],
      [SE.slowTime, [10, [RE.rhaa, RE.tempus], false]],
      [SE.controlDemon, [10, [RE.movis, RE.comunicatum]]],
    ].map(
      ([se, [page, seq, hasSound = true]]: any, idx) =>
        new Spell(se, seq, page, hasSound, idx)
    );
  })();

  static pointsOf(se: SpellEnum) {
    return this.#spells.find((x) => x.#spell === se)!.points;
  }

  static tryCast(seq: Rune[], onSuccess: CallableFunction) {
    console.debug("trying to cast sequence", seq);
    const idx = this.#spells.findIndex((sp) => sp.seqMatches(seq));
    if (idx > -1) {
      const spell = this.#spells[idx];
      spell.play();
      onSuccess(spell);
    } else {
      // play fizzle
      this.#spells[1].play();
    }
  }

  #spell: SpellEnum;
  page: number;
  idx: number;
  #seq: RE[];
  #mp3?: HTMLAudioElement;

  constructor(
    spell: SpellEnum,
    seq: RE[],
    page: number,
    hasSound: boolean,
    idx: number
  ) {
    this.#spell = spell;
    this.page = page;
    this.idx = idx;
    this.#seq = seq;

    if (hasSound) {
      const path = `/arx/spells/${this.asStr("-")}.mp3`;
      this.#mp3 = new Audio(path);
      this.#mp3.preload = "auto";
    }
  }

  get points(): number {
    return this.page * this.#seq.length;
  }

  seqMatches(seq: Rune[]): boolean {
    if (seq.length !== this.#seq.length) return false;

    for (let i = 0; i < seq.length; i++) {
      if (seq[i].variant !== this.#seq[i]) return false;
    }

    return true;
  }

  play() {
    if (this.#mp3) {
      console.debug(`playing ${this.name}`);
      this.#mp3.currentTime = 0;
      this.#mp3.play();
    }
  }

  get name() {
    return this.asStr();
  }

  asStr(delim = " ") {
    let res = "";

    for (let ch of SE[this.#spell]) {
      if (ch === ch.toUpperCase()) {
        res += delim;
        ch = ch.toLowerCase();
      }
      res += ch;
    }
    return res;
  }
}
