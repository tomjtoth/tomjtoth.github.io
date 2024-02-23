const div_runes = document.querySelector('div#runes');
const p_feedback = document.querySelector('p#feedback');

const runes = new Map((
    'Aam,0.2,0.7;Nhi,0.15,0.7;Mega,0.15,1.0;Yok,0.2,0.7;Taar,0.25,0.9;'
    + 'Kaom,0.2,1.05;Vitae,0.2,1.0;Vista,0.3,1.1;Stregum,0.1,1.25;Morte,0.25,1.2;'
    + 'Cosum,0.15,1.2;Comunicatum,0.15,1.65;Movis,0.3,1.2;Tempus,0.3,1.3;Folgora,0.15,1.2;'
    + 'Spacium,0.3,1.4;Tera,0.2,1.0;Cetrius,0.15,1.3;Rhaa,0.3,0.9;Fridd,0.15,1.5'
)
    .split(';')
    .map((conf) => {
        const [rune, beginning, ending] = conf.split(',')

        // create the <img>
        const lower_case = rune.toLowerCase();
        const img = document.createElement('img');
        img.title = img.alt = rune;
        img.draggable = false;
        img.setAttribute('src', `runes/${lower_case}.png`);
        div_runes.appendChild(img);

        // create the audio
        const sound = new Audio(`runes/${lower_case}.mp3`);

        return [rune, [sound, parseFloat(beginning), parseFloat(ending)]]
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

const negative_feedback = (
    'Interesting!'
    + ';Whoops!'
    + ';hmm...'
    + ';That didn\'t work out!'
    + ';Your pants caught on fire...'
    + ';Your nose started itching like hell!'
    + ';Put your thinking cap on!'
    + ';...was it Aam Taar Vitae?'
).split(';');

const queue = [];
let
    currently_playing_idx = 0,
    first_sound_counter = 0;

div_runes.addEventListener('click', ({ target }) => {
    if (target.tagName !== 'IMG') return;

    // Pause the animation
    target.style.animationPlayState = 'paused';

    // Set the currentTime property to 0
    target.style.animation = 'none';
    target.offsetHeight; /* trigger reflow */
    target.style.animation = null;

    queue.push(target.title);

    if (first_sound_counter++ == 0)
        play_next_sound();
})

function play_next_sound() {

    if (currently_playing_idx >= queue.length) {
        check_spellbook();
        queue.length = 0;
        currently_playing_idx = 0;
        first_sound_counter = 0;
        return;
    }

    const [audio, beginning, ending] = runes.get(queue[currently_playing_idx++]);

    // skip to the relevant part
    audio.currentTime = beginning;
    audio.play();

    // start playing the next sound
    setTimeout(() => {
        play_next_sound();
    }, (ending - beginning) * 1000)
}


function check_spellbook() {
    let valid = false;

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
            p_feedback.textContent = `You succeeded casting ${spell}...`;
            break;
        }

    }

    if (!valid) p_feedback.textContent = negative_feedback[
        Math.floor(Math.random() * negative_feedback.length)
    ];
}
