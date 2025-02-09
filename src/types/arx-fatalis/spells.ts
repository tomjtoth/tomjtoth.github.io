import { RE } from "./runes";

export enum SE {
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

export class Spell {
  private static spells: Spell[] = (() => {
    console.debug("initializing Spells");

    return [
      [
        SE.megaCheat,
        [0, [RE.Mega, RE.Mega, RE.Mega, RE.Aam, RE.Vitae, RE.Tera], false],
      ],
      [SE.fizzle, [0, []]],
      [SE.activatePortal, [1, [RE.Mega, RE.Spacium], false]],
      [SE.magicMissile, [1, [RE.Aam, RE.Taar]]],
      [SE.nightVision, [1, [RE.Mega, RE.Vista]]],
      [SE.douse, [1, [RE.Nhi, RE.Yok]]],
      [SE.ignite, [1, [RE.Aam, RE.Yok]]],
      [SE.armor, [2, [RE.Mega, RE.Kaom]]],
      [SE.harm, [2, [RE.Rhaa, RE.Vitae]]],
      [SE.lowerArmor, [2, [RE.Rhaa, RE.Kaom]]],
      [SE.heal, [2, [RE.Mega, RE.Vitae]]],
      [SE.detectTrap, [2, [RE.Morte, RE.Cosum, RE.Vista]]],
      [SE.fireball, [3, [RE.Aam, RE.Yok, RE.Taar], false]],
      [SE.reveal, [3, [RE.Nhi, RE.Stregum, RE.Vista], false]],
      [SE.iceProjection, [3, [RE.Aam, RE.Fridd, RE.Taar]]],
      [SE.speed, [3, [RE.Mega, RE.Movis]]],
      [SE.feed, [3, [RE.Aam, RE.Vitae, RE.Cosum]]],
      [SE.telekinesis, [4, [RE.Spacium, RE.Comunicatum]]],
      [SE.protectionFromCold, [4, [RE.Fridd, RE.Kaom]]],
      [SE.bless, [4, [RE.Mega, RE.Stregum, RE.Vitae]]],
      [SE.dispelField, [4, [RE.Nhi, RE.Spacium]]],
      [SE.protectionFromFire, [4, [RE.Yok, RE.Kaom]]],
      [SE.curse, [4, [RE.Rhaa, RE.Stregum, RE.Vitae]]],
      [SE.trap, [5, [RE.Aam, RE.Morte, RE.Cosum], false]],
      [SE.cureEffectsOfPoison, [5, [RE.Nhi, RE.Cetrius]]],
      [SE.repelUndead, [5, [RE.Morte, RE.Kaom]]],
      [SE.levitate, [5, [RE.Mega, RE.Spacium, RE.Movis]]],
      [SE.poisonProjection, [5, [RE.Aam, RE.Cetrius, RE.Taar]]],
      [SE.slowDown, [5, [RE.Rhaa, RE.Movis]]],
      [SE.disableTrap, [6, [RE.Nhi, RE.Morte, RE.Cosum]]],
      [SE.createField, [6, [RE.Aam, RE.Kaom, RE.Spacium]]],
      [SE.raiseDead, [6, [RE.Aam, RE.Morte, RE.Vitae]]],
      [SE.paralyze, [6, [RE.Nhi, RE.Movis]]],
      [SE.fireField, [7, [RE.Aam, RE.Yok, RE.Spacium]]],
      [SE.iceField, [7, [RE.Aam, RE.Fridd, RE.Spacium]]],
      [SE.confuse, [7, [RE.Nhi, RE.Vista]]],
      [SE.lightningProjection, [7, [RE.Aam, RE.Folgora, RE.Taar]]],
      [SE.flyingEye, [7, [RE.Vista, RE.Movis]]],
      [SE.manaDrain, [8, [RE.Stregum, RE.Movis], false]],
      [SE.enchantObject, [8, [RE.Mega, RE.Stregum, RE.Cosum]]],
      [SE.chaos, [8, [RE.Aam, RE.Mega, RE.Morte], false]],
      [SE.invisibility, [8, [RE.Nhi, RE.Vista]]],
      [SE.lifeDrain, [8, [RE.Vitae, RE.Movis], false]],
      [SE.summon, [9, [RE.Aam, RE.Vitae, RE.Tera]]],
      [SE.massParalyze, [9, [RE.Mega, RE.Nhi, RE.Movis]]],
      [SE.incinerate, [9, [RE.Aam, RE.Mega, RE.Yok]]],
      [SE.negateMagic, [9, [RE.Nhi, RE.Stregum, RE.Spacium]]],
      [
        SE.massLightningProjection,
        [10, [RE.Aam, RE.Folgora, RE.Spacium], false],
      ],
      [SE.massIncinerate, [10, [RE.Mega, RE.Aam, RE.Mega, RE.Yok]]],
      [SE.slowTime, [10, [RE.Rhaa, RE.Tempus], false]],
      [SE.controlDemon, [10, [RE.Movis, RE.Comunicatum]]],
    ].map(
      ([se, [page, seq, hasSound = true]]: any) =>
        new Spell(se, seq, page, hasSound)
    );
  })();

  // based on https://wiki.arx-libertatis.org/Spells

  static pointsOf(sEnum: SE) {
    return this.spells.find((x) => x.spell === sEnum)!.points();
  }

  static tryCast(seq: RE[], onSuccess: CallableFunction) {
    if (seq.length > 0) {
      const idx = this.spells.findIndex((sp) => sp.seqMatches(seq));
      if (idx > -1) {
        const spell = this.spells[idx];
        spell.play();
        onSuccess(idx, spell.asStr(), spell.page);
      } else {
        // play fizzle
        this.spells[1].play();
      }
    }
  }

  private spell: SE;
  private page: number;
  private seq: RE[];
  private mp3?: HTMLAudioElement;

  constructor(spell: SE, seq: RE[], page: number, hasSound = true) {
    this.spell = spell;
    this.seq = seq;
    this.page = page;

    if (hasSound) {
      const path = `/arx/spells/${this.asStr("-")}.mp3`;
      this.mp3 = new Audio(path);
      this.mp3.preload = "auto";
    }
  }

  points(): number {
    return this.page * this.seq.length;
  }

  seqMatches(seq: RE[]): boolean {
    if (seq.length !== this.seq.length) return false;

    for (let i = 0; i < seq.length; i++) {
      if (seq[i] !== this.seq[i]) return false;
    }

    return true;
  }

  play() {
    if (this.mp3) {
      console.debug(`playing ${this.asStr()}`);
      this.mp3.currentTime = 0;
      this.mp3.play();
    }
  }

  asStr(delim = " ") {
    let res = "";

    for (let ch of SE[this.spell]) {
      if (ch === ch.toUpperCase()) {
        res += delim;
        ch = ch.toLowerCase();
      }
      res += ch;
    }
    return res;
  }
}
