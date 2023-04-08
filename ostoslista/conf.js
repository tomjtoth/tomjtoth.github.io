const cookbook = Array.from(`
# 🌯 tortilla

- paista sipulit
- sitten lisää sienet
- lopuksi lisää lihaa, ja jauhe ennen kuin neste haihtuisi

tortillawraps
sipuli
700 g kanasuikaleet
sienet
salaatti
viilikerma
salsa
tortillamauste


# 🍕 pitsa

eka 3 kerrosta tulee olla:
- tomaattikastike
- pitsamauste ja juustoraaste

pitsa
oliivit
kalkkuna
ananas
juustoraaste


# 🍖 karjalanpaisti

500 g karjalanpaistia
2 porkkanaa
sipuli
laakerinlehdet
kokonaiset maustepippurit
perunat
vihannekset


# 🍗 kana ja riisi

500 g kanafileet
riisi
vihannekset


# 🍜 wokki

wokkivihannekset
500-700 g marinoitu kana
nuudelit
mifu


# 🍝 soijabolognese

soijarouhe
makaroni
tomaattimurska
sipuli
valkosipuli
soijakastike
ketsuppi
kasvisliemikuutio
pizzamauste


# 🍲 broilerijauhelihapata

400 g kanajauheliha
sipuli
valkosipuli
mauste
curry
kaneli
liemikuutio
300 g perunoita
300 g bataattia
200 g maissi
sitruunamehu


# 🐓 broilerivuoka

makaroni
valkosipuli
300-500 g kanan fileesuikaleet
tomaattimurska
150 g pakastepinaatti


# 🐔 uunikana

400-600 g kanafileet
4-6 perunaa
2 porkkanaa
parsa- tai kukkakaali
oliivit
rosmariini


# 🐟 lohi

lohi
riisi?
perunat?
vihannekset


# 🐟 seiti

seiti
maissi
riisi?
500g perunaa?
curry?
kookosmaito tai -kerma


# 🐥 broilerikiusaus

1 kg peruna-sipulisekoitus
500 g kanasuikaleet
rosmariini
curry
2 kpl kerma
koskenlaskija-dippi
vihannekset


# 🐷 kinkkukiusaus

1 kg peruna-sipulisekoitus
300 g kotimaista keittokinkkua
2 kpl pippurikerma
vihannekset


# 🥕 vakioruoka

käytä toi UFO höyrytinjuttu

kilon porkkanat
700 g kanasuikaleet


# 🥘 pippurinen kanapata

400-600 g kanafileet
sipuli
100 g herkkusieniä
200 g ruusukaalia
kasvisliemikuutio
tomaattimurska
koskenlaskija-juusto
perunat


# 🥞 kuivakakku
@ dessert

2dl rusinoita
banaani
2dl banaanijogurttia
2 munaa
3dl sokeria


# 🫓 lángos

- 3dl jauhoa + suolaa laitat isoon kulhoon*
- maito mukiin -> 36˚
- siihen laitat hiivaa + sokeria
- 5 minuuttia annat ne piereskelemään, laitat jonnekin lämpimään
- kaadat mukin kulhoon*
- 1 sormella sekoitat, sitten összegyúrod

0,5dl maito
0,5 teeusikka sokeri
0,5 teelusikka suola
3dl vehnäjauho
50g hiiva (riittää 4 päivälle)
`
// https://regex101.com/r/ofnra6
.matchAll(/# (?<name>[^\n]+)\n(?:\@ (?<type>[^\n]+)\n)?\n(?:(?<instr>[^#]+?)\n\n)?(?<ingr>[^#]+?)(?:\n\n|\n$)/gms))
.map(mobj => {
    let name = mobj.groups.name;
    let type = mobj.groups.type;
    let instructions = mobj.groups.instr;
    let ingredients = mobj.groups.ingr.split('\n');
    return {name, type, instructions, ingredients}
});

// arranges ingredients the way I go through my local shop
const regexes = [
    /(cit+ari|K-supermarket|K-citimarket):?(sta)?/,
    /tokman+i/,
    /rosmari+ni|pi(ts|zz)amaus|la+kerinleh|kaneli|(musta.*)?pip+uri|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste/,
    /wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i/,
    /kokis|kalja|olut|pepsi|mehu/,
    /banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l/,
    /perun(a|oi).*(?!lastu|sipuli)|(?!^perun.*)sipuli|parsa.*ka+li|pork+ana|sala+t+i|(?!^wok.*)vihan+ek?s|bata+t+i/,
    /(?!^ko+kos.*)(mai[dt]o|kerma)|voi|jogh?urt|hi+va/,
    /(?!^veke)juusto|(koskenlask)?dip+i?/,
    /liha|kana(?!.*muna)|mifu/,
    /karjalanpa/,
    /kalk+una|kink+u/,
    /pitsa|ri+sipi+rak+a/,
    /perunalastu|pähkinä|sipsi/,
    /muna|oli+vi|toma+t+imurska|ananas|ko+kos/,
    /lei[pv]ä/,
    /nu+deli|makaroni|soija.*r.*h|ri+si|öljy/,
    /vehnäja|muro|mysli/,
    /sokeri/,
    /hernek/,
    /suklaa|kark+i/,
    /pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y/,
    /vekeju+sto|loh[ei]/,
];
