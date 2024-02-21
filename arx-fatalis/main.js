const runes = new Map((
    'Aam,Cetrius,Comunicatum,Cosum,Folgora,'
    + 'Fridd,Kaom,Mega,Morte,Movis,'
    + 'Nhi,Rhaa,Spacium,Stregum,Taar,'
    + 'Tempus,Tera,Vista,Vitae,Yok'
)
    .split(',')
    .map((rune) => {
        const lower_case = rune.toLowerCase();
        const img = document.createElement('img');
        img.title = img.alt = rune;
        img.setAttribute('src', `runes/${lower_case}.png`);
        document.body.appendChild(img);

        const sound = new Audio(`runes/${lower_case}.mp3`);
        sound.addEventListener('ended', () => img.classList.remove('active'));

        return [rune, sound]
    })
);

document.body.addEventListener('click', ({ target: { tagName, title: rune, classList } }) => {
    if (tagName !== 'IMG') return;
    classList.add('active');
    runes.get(rune).play();
})

