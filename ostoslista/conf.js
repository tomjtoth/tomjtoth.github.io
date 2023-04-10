const re_ingredients = /"([^"]+)"(?: *[-:])?/g;
const re_tags = /(?<=#)\S+/g;

// dishes between emojis
const cookbook = Array.from(`
🌯 tortilla
#windy #spicy
-5

- pilkkoo ja paista "sipuli"
- lisää "sienisäilyke" kyytiin
- lisää "700g kanasuikale" -et, ja "tortillamauste" ennen kuin sen neste haihtuisi

lopuksi annostele "tortillawraps" -iin, laita päälle "villikerma" + "salsakastike" ja "salaatti"


🍕 pitsa
#coke
+5

- rullaa "pitsataikina" auki ja levitä tomaattikastike
- ripottele vähän "pizzamauste" ja "juustoraaste"
- pilkkoo "kalkkuna" ja laita päälle
- avaa "ananassäilyke" ja levitä nekin
- laita "oliivit" myös


🍲 kanapasta
#csirke #tészta #brokkoli
-10

- laita "300-500 g maustamattomat kanasuikaleet" pannulle ruskistumaan, mausta suolalla ja lisää hetken päästä joukkoon "100 g herkkusieni"
- laita "400 g makaroni" kiehumaan ja jos haluat niin myös "parsakaali" omaan erilliseen kattilaan
- lisää kanan joukkoon "kolme pippuria tuorejuusto" ja 1 dl vettä, sekoita ja anna hautua
- ruoka on valmis, kun makaronit (ja parsakaali) ovat kypsiä

🍗 kana ja riisi
#kana #rizs
+10

- paista "500g kanafileet"
- keitä "riisi"
- laita riisin kyytiin "pakastevihannekset"

🍜 wokki
#mifu #wokki #nuudeli
+10

- ruskista "mifu" tai "500–700 g marinoitu kana" pannulla
- samaan aikaan keitä " 2 kpl nuudelipussi" 5 desilitrassa vettä
- lisää "wokkivihannekset" mifun joukkoon ja paista kypsäksi
- kun vesi on imeytynyt nuudeleihin, sekoita kaikki ainekset keskenään

🍝 soijabolognese
#soijarouhe
+10

- pilko 1 kpl "sipuli", 2 kpl "valkosipuli" ja lisää pannulle
- kun sipulit alkavat paistua, lisää 2 dl "soijarouhe" joukkoon
- lisää noin 2 rkl "soijakastike" ja sekoita
- lisää "400g tomaattimurska", lisää vettä purkkiin ja kaada pannulle
- lisää "kasvisliemikuutio", "ketsuppi", "pizzamauste" ja "pippuri" ja jätä kastike hautumaan
- laita "makaroni" kiehumaan, lisää hieman "suola" ja kun makaronit ovat kypsiä niin jó étvágyat!

🍲 broilerijauhelihapata
#ONION #windy #jauheliha #bataatti #peruna

- pilko 1 kpl "sipuli", 2 kpl "valkosipuli" ja lisää ne pannulle
- kun sipulit alkaa paistua, lisää "400g kanajauheliha" mukaan ja paista niin ettei näy enää pinkkiä väriä
- pilko ja kuori samalla "300 g peruna" ja "300 g bataatti"
- laita kanan sekaan "suola", "pippuri", "curry" ja "kaneli"
- lisää 5 dl vettä ja "kasvisliemikuutio" joukkoon ja sekoita
- lisää perunat, bataatit ja "200 g maissi" ja sekoita
- anna hautua liedellä kunnes juurekset ovat pehmeitä

🐓 kanakastike
#unclebens
-3

- ruskista "300-500 g kanasuikaleet" pannulla ja kun suikaleet ovat ruskistuneet lisää "uncle ben's -kastike" ja anna hautua vähän aikaa
- keitä samalla 3 dl "riisi" ja lisää sekaan "200 g maissi"

🐔 uunikana
#chickenintheoven
+5
- kuori ja pilko "500 g peruna", "2 kpl porkkana" ja "parsakaali" sekä laita ne kulhoon
- mausta kasvikset "suola", "pippuri", "rosmariini" ja jos haluat niin myös "paprikamauste"
- voitele uunivuoka öljyllä ja asettele siihen "marinoidut kanafileet" ja heitä päälle maustetut kasvikset
- anna kypsentyä uunissa 1 h

🐟 lohi
#lohifilee
-10

- ota uunipelti ja laita siihen leivinpaperi sekä folio
- laita "lohi" pellille ja mausta "suola" ja "pippuri" sekä kääri folioon
- laita uuniin 30-40 minuutiksi
- laita vesi riisille kiehumaan, lisää myös "kasvisliemikuutio" ja "maissi" joukkoon

🐟 seiti
#fisk
+10

- paista pannulla "seiti"
- samalla keitä "riisi" 
- enne kuin riisin kaikki nesteet haihtuisi, lisää kyytiin "200g maissi"
- vaihtoehtoisesti tee muussi "500g peruna" -sta

🍔 hampparit
#jättebra #hamburgare
+5

- paista "halloumi" pannulla
- paahda "hampparisämpylät" leivänpaahtimessa
- lisää "hampparikastike", "cheddar" ja "salaatti"

🐷 kinkkukiusaus
#kinkku
-5

- pilko "keittokinkku"
- voitele uunivuoka öljyllä ja lisää siihen "1 kg peruna-sipulisekoitus" ja "keittokinkku"
- lisää kulhoon "2 kpl ruokakerma" ja lisää joukkoon mausteita esim. "suola", "pippuri" ja "timjami", sekoita ja kaada vuokaan ruuan päälle
- kypsennä uunissa 1 h
- voit keittää liedellä lisäksi "pakastevihannekset"

🥕 vakioruoka
#since2018
-10

- pilko ja keitä 1 kg "porkkanat", käytä toi UFO höyrytinjuttu
- paista "700 g kanasuikaleet"

🥘 makaronimuhennos
#pääkallopata
1

- pilko "1 kpl sipuli" ja "2 kpl valkosipuli" ja lisää ne pannulla
- kun sipuli alkaa paistua, lisää joukkoon "400 g kanajauheliha" ja paista kunnes pinkki väri hävinnyt
- mausta seos "suola", "pippuri", "curry", "kaneli" ja "paprikamauste". älä paista liian kauan, ettei mausteet pala ja seos kuivu!
- laita samalla "400 g makaroni" kiehumaan, lisää veteen "kasvisliemikuutio"
- kun makaronit ja lihaseos ovat kypsiä, sekoita ne ja nauti!

🥞 kuivakakku
#dessert #nam

2dl rusinoita
banaani
2dl banaanijogurttia
2 munaa
3dl sokeria


🫓 lángos
#easy #greasy #hungarian #delicious
+10

- laita isoon kulhoon "3dl vehnäjauhoa" + "0,5tl suolaa"
- lämmitä mukissa "0,5dl maito" 36 asteiseksi
- revi (maitoon) pieniksi paloiksi "12,5g tuorehiivaa"
- lisää "0,5tl sokeria"
- anna hiivat tehostumaan 5 minuuttia jossain lämpimässä paikassa
- kaada mukin sisällöt kulhoon ja sekoitat (alussa 1 sormella)
- kun taikina ei enää jää kiinni kulhoon, laita ~tunniksi takaisin
#TAUKO
- aloita venyttämään taikinaa leveäksi lautaseksi
- 180 asteiseen "3dl öljy" -yn heitä 1 kerralla (litrasessa kattilassa)
- laita paistetut taikinat lautaselle, jossa 1kpl servetti (imee öljyn)
- murskaa "1-2kpl valkosipulia" ja löystä se vedellä ja pari tipalla öljyllä
- levitä eka sipulinesteen paistetun taikinan päälle
- sitten tulee "villikerma"
- ja lopuksi "juustoraaste"
`
//https://regex101.com/r/UuPPL1/1
.matchAll(/(?<name>\p{Emoji_Presentation} .+)\n+(?:(?<tags>(?:#\S+ )*#\S+)\n+)?(?:(?<pref>[+-]?\d+)\n+)?(?<descr>\P{Emoji_Presentation}+)\n/ug))
.map(mo_dish => {
    const name = mo_dish.groups.name;
    const tags = Array.from((mo_dish.groups.tags
        ? mo_dish.groups.tags
        : ''
    ).matchAll(re_tags)).map(mo_tag => mo_tag[0]);
    const preference = parseInt(mo_dish.groups.pref);
    const instructions = mo_dish.groups.descr.replace(re_ingredients, '$1');
    const ingredients = Array.from(mo_dish.groups.descr.matchAll(re_ingredients)).map(mo_i => mo_i[1]);
    return {name, tags,preference, instructions, ingredients}
});

// arranges ingredients the way I go through my local shop
const regexes = [
    /(cit+ari|K-supermarket|K-citimarket):?(sta)?/,
    /tokman+i/,
    /rosmari+ni|pi(ts|zz)amaus|la+kerinleh|timjami|kaneli|(musta.*)?pip+uri|suola+|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste/,
    /wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i/,
    /kokis|kalja|olut|pepsi|mehu/,
    /banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l/,
    /perun(a|oi).*(?!lastu|sipuli)|(?!^perun.*)sipuli|parsa.*ka+li|pork+ana|sala+t+i|(?!^wok.*)vihan+ek?s|bata+t+i/,
    /(?!^ko+kos.*)(?:mai[dt]o|kerma)|voi|jogh?urt|hi+va/,
    /(?!^veke)juusto|(koskenlask)?.+dip+i?|hallou?m|cheddar/,
    /liha|kana(?!.*muna)|mifu/,
    /karjalanpa/,
    /kalk+una|kink+u/,
    /pitsa|ri+sipi+rak+a/,
    /perunalastu|pähkinä|sipsi|hampparikastike/,
    /muna|oli+vi|toma+t+imurska|ananas|ko+kos/,
    /lei[pv]ä|sämpylä/,
    /nu+deli|makaroni|soija.*r.*h|ri+si|öljy/,
    /vehnäja|muro|mysli/,
    /uncle ben/i,
    /sokeri/,
    /hernek/,
    /suklaa|kark+i/,
    /pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y/,
    /vekeju+sto|loh[ei]/,
];
