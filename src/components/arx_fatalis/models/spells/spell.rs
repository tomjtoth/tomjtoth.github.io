use std::fmt;

use serde_repr::{Deserialize_repr, Serialize_repr};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

use crate::components::{
    arx_fatalis::models::runes::Rune::{self, *},
    audio::*,
};

use Spell::*;

#[derive(Debug, EnumIter, Serialize_repr, Deserialize_repr)]
#[repr(u8)]
pub(crate) enum Spell {
    MegaCheat,
    Fizzle,
    ActivatePortal,
    MagicMissile,
    NightVision,
    Douse,
    Ignite,
    Armor,
    Harm,
    LowerArmor,
    Heal,
    DetectTrap,
    Fireball,
    Reveal,
    IceProjection,
    Speed,
    Feed,
    Telekinesis,
    ProtectionFromCold,
    Bless,
    DispelField,
    ProtectionFromFire,
    Curse,
    Trap,
    CureEffectsOfPoison,
    RepelUndead,
    Levitate,
    PoisonProjection,
    SlowDown,
    DisableTrap,
    CreateField,
    RaiseDead,
    Paralyze,
    FireField,
    IceField,
    Confuse,
    LightningProjection,
    FlyingEye,
    ManaDrain,
    EnchantObject,
    Chaos,
    Invisibility,
    LifeDrain,
    Summon,
    MassParalyze,
    Incinerate,
    NegateMagic,
    MassLightningProjection,
    MassIncinerate,
    SlowTime,
    ControlDemon,
}

impl fmt::Display for Spell {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Spell {
    pub(crate) fn by_seq(seq: Vec<Rune>) -> Option<(Spell, u8)> {
        for spell in Spell::iter() {
            let (page, runes) = spell.details();
            if seq == runes {
                return Some((spell, page));
            }
        }
        return None;
    }

    pub(crate) fn points(&self) -> u64 {
        let (page, seq) = self.details();
        (page * (seq.len() as u8)) as u64
    }

    // based on https://wiki.arx-libertatis.org/Spells
    fn details(&self) -> (u8, Vec<Rune>) {
        match self {
            MegaCheat => (0, vec![Mega, Mega, Mega, Aam, Vitae, Tera]),
            Fizzle => (0, vec![]),
            ActivatePortal => (1, vec![Mega, Spacium]),
            MagicMissile => (1, vec![Aam, Taar]),
            NightVision => (1, vec![Mega, Vista]),
            Douse => (1, vec![Nhi, Yok]),
            Ignite => (1, vec![Aam, Yok]),
            Armor => (2, vec![Mega, Kaom]),
            Harm => (2, vec![Rhaa, Vitae]),
            LowerArmor => (2, vec![Rhaa, Kaom]),
            Heal => (2, vec![Mega, Vitae]),
            DetectTrap => (2, vec![Morte, Cosum, Vista]),
            Fireball => (3, vec![Aam, Yok, Taar]),
            Reveal => (3, vec![Nhi, Stregum, Vista]),
            IceProjection => (3, vec![Aam, Fridd, Taar]),
            Speed => (3, vec![Mega, Movis]),
            Feed => (3, vec![Aam, Vitae, Cosum]),
            Telekinesis => (4, vec![Spacium, Comunicatum]),
            ProtectionFromCold => (4, vec![Fridd, Kaom]),
            Bless => (4, vec![Mega, Stregum, Vitae]),
            DispelField => (4, vec![Nhi, Spacium]),
            ProtectionFromFire => (4, vec![Yok, Kaom]),
            Curse => (4, vec![Rhaa, Stregum, Vitae]),
            Trap => (5, vec![Aam, Morte, Cosum]),
            CureEffectsOfPoison => (5, vec![Nhi, Cetrius]),
            RepelUndead => (5, vec![Morte, Kaom]),
            Levitate => (5, vec![Mega, Spacium, Movis]),
            PoisonProjection => (5, vec![Aam, Cetrius, Taar]),
            SlowDown => (5, vec![Rhaa, Movis]),
            DisableTrap => (6, vec![Nhi, Morte, Cosum]),
            CreateField => (6, vec![Aam, Kaom, Spacium]),
            RaiseDead => (6, vec![Aam, Morte, Vitae]),
            Paralyze => (6, vec![Nhi, Movis]),
            FireField => (7, vec![Aam, Yok, Spacium]),
            IceField => (7, vec![Aam, Fridd, Spacium]),
            Confuse => (7, vec![Nhi, Vista]),
            LightningProjection => (7, vec![Aam, Folgora, Taar]),
            FlyingEye => (7, vec![Vista, Movis]),
            ManaDrain => (8, vec![Stregum, Movis]),
            EnchantObject => (8, vec![Mega, Stregum, Cosum]),
            Chaos => (8, vec![Aam, Mega, Morte]),
            Invisibility => (8, vec![Nhi, Vista]),
            LifeDrain => (8, vec![Vitae, Movis]),
            Summon => (9, vec![Aam, Vitae, Tera]),
            MassParalyze => (9, vec![Mega, Nhi, Movis]),
            Incinerate => (9, vec![Aam, Mega, Yok]),
            NegateMagic => (9, vec![Nhi, Stregum, Spacium]),
            MassLightningProjection => (10, vec![Aam, Folgora, Spacium]),
            MassIncinerate => (10, vec![Mega, Aam, Mega, Yok]),
            SlowTime => (10, vec![Rhaa, Tempus]),
            ControlDemon => (10, vec![Movis, Comunicatum]),
        }
    }

    pub(crate) fn play(&self) {
        AUDIO.play(&self.as_src());
    }

    pub(crate) fn as_src(&self) -> String {
        format!("/arx/spells/{}.mp3", self.to_kebab_case(None))
    }

    // pub(crate) fn name(&self) -> String {
    //     self.to_kebab_case(Some(' '))
    // }

    fn to_kebab_case(&self, delim: Option<char>) -> String {
        let name = self.to_string();
        let mut result = String::with_capacity(name.len() + 2);

        for (i, c) in name.chars().enumerate() {
            if c.is_uppercase() {
                if i != 0 {
                    result.push(if let Some(d) = delim { d } else { '-' });
                }
                result.push(c.to_ascii_lowercase());
            } else {
                result.push(c);
            }
        }

        result
    }
}
