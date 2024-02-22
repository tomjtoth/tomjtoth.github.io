const div_runes = document.querySelector('div#runes');
const p_feedback = document.querySelector('p#feedback');

const runes = new Map((
    'Aam,Nhi,Mega,Yok,Taar,'
    + 'Kaom,Vitae,Vista,Stregum,Morte,'
    + 'Cosum,Comunicatum,Movis,Tempus,Folgora,'
    + 'Spacium,Tera,Cetrius,Rhaa,Fridd'
)
    .split(',')
    .map((rune) => {
        // create the <img>
        const lower_case = rune.toLowerCase();
        const img = document.createElement('img');
        img.title = img.alt = rune;
        img.draggable = false;
        img.setAttribute('src', `runes/${lower_case}.png`);
        div_runes.appendChild(img);

        // create the audio
        const sound = new Audio(`runes/${lower_case}.mp3`);

        return [rune, sound]
    })
);

const spells = new Map((
    '0:Mega cheat:Mega,Mega,Mega,Aam,Vitae,Tera;'
    + '1:Activate portal:Mega,Spacium;'
    + '1:Magic missile:Aam,Taar;'
    + '1:Night vision:Mega,Vista;'
    + '1:Douse:Nhi,Yok;'
    + '1:Ignite:Aam,Yok;'
    + '2:Armor:Mega,Kaom;'
    + '2:Harm:Rhaa,Vitae;'
    + '2:Lower armor:Rhaa,Kaom;'
    + '2:Heal:Mega,Vitae;'
    + '2:Detect trap:Morte,Cosum,Vista;'
    + '3:Fireball:Aam,Yok,Taar;'
    + '3:Reveal:Nhi,Stregum,Vista;'
    + '3:Ice projection:Aam,Fridd,Taar;'
    + '3:Speed:Mega,Movis;'
    + '3:Feed:Aam,Vitae,Cosum;'
    + '4:Telekinesis:Spacium,Comunicatum;'
    + '4:Protection from cold:Fridd,Kaom;'
    + '4:Bless:Mega,Stregum,Vitae;'
    + '4:Dispel field:Nhi,Spacium;'
    + '4:Protection from fire:Yok,Kaom;'
    + '4:Curse:Rhaa,Stregum,Vitae;'
    + '5:Trap:Aam,Morte,Cosum;'
    + '5:Cure effects of poison:Nhi,Cetrius;'
    + '5:Repeal undead:Morte,Kaom;'
    + '5:Levitate:Mega,Spacium,Movis;'
    + '5:Poison projection:Aam,Cetrius,Taar;'
    + '5:Slow down:Rhaa,Movis;'
    + '6:Disable trap:Nhi,Morte,Cosum;'
    + '6:Create field:Aam,Kaom,Spacium;'
    + '6:Raise dead:Aam,Morte,Vitae;'
    + '6:Paralyze:Nhi,Movis;'
    + '7:Fire field:Aam,Yok,Spacium;'
    + '7:Ice field:Aam,Fridd,Spacium;'
    + '7:Confuse:Nhi,Vista;'
    + '7:Lightning projection:Aam,Folgora,Taar;'
    + '7:Flying eye:Vista,Movis;'
    + '8:Mana drain:Stregum,Movis;'
    + '8:Enchant object:Mega,Stregum,Cosum;'
    + '8:Chaos:Aam,Mega,Morte;'
    + '8:Invisibility:Nhi,Vista;'
    + '8:Life drain:Vitae,Movis;'
    + '9:Summon:Aam,Vitae,Tera;'
    + '9:Mass paralyze:Mega,Nhi,Movis;'
    + '9:Incinerate:Aam,Mega,Yok;'
    + '9:Negate magic:Nhi,Stregum,Spacium;'
    + '10:Mass lightning projection:Aam,Folgora,Spacium;'
    + '10:Mass incinerate:Mega,Aam,Mega,Yok;'
    + '10:Slow time:Rhaa,Tempus;'
    + '10:Control demon:Movis,Comunicatum'
)
    .split(';')
    .map((row) => {
        const [_page, spell, runes] = row.split(':');
        return [spell, runes.split(',')];
    }))

const queue = [];
let counter = 0;

div_runes.addEventListener('click', ({ target }) => {
    if (target.tagName !== 'IMG') return;

    // Pause the animation
    target.style.animationPlayState = 'paused';

    // Set the currentTime property to 0
    target.style.animation = 'none';
    target.offsetHeight; /* trigger reflow */
    target.style.animation = null;

    queue.push(target.title);

    const audio = runes.get(target.title);
    // skip first 150ms (?)
    audio.currentTime = 0.15;
    audio.play();

    ++counter;
    setTimeout(() => {
        if (--counter == 0) check_spellbook();
    }, 750);
})


function check_spellbook() {
    let valid = true;

    for (const [spell, runes] of spells.entries()) {
        const
            rl = runes.length,
            ql = queue.length;
        if (ql != rl) continue;

        valid = true;

        for (let i = 0; i < rl; i++) {
            if (queue[ql - i - 1] !== runes[rl - i - 1]) {
                valid = false;
                break;
            }
        }

        if (valid) {
            p_feedback.textContent = `You just cast ${spell}...`;
            break;
        }

    }
    if (!valid) p_feedback.textContent = `Interesting!`;
    queue.length = 0;
}
