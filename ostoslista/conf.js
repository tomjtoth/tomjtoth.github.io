// https://regex101.com/r/UuPPL1    
const re_dishes = /## \[?(?<name>\p{Emoji_Presentation} .+?)(?:\]\((?<url>[^\)]+)\))?\n+(?:(?<tags>(?:#\S+ )*#\S+)\n+)?(?:(?<pref>[+-]?\d+)\n+)?(?<descr>(?:.|\n)+?(?=\n## |\n$))/ug;

// https://regex101.com/r/kmOAfs
const re_ingredients = /\[`(?<ingr0>[^`]+)`\]\((?<url>[^)]+)\)|`(?<ingr1>[^`]+)`/g;
const re_tags = /(?<=#)\S+/g;

// arranges ingredients the way I go through my local shop
const regexes = [
    // ennen PRISMA:a
    /(cit+ari|K-supermarket|K-cit[iy]market):?(sta)?/,
    /tokman+i/,

    // PRISMA:sta
    /rosmari+ni|pi(ts|zz)amaus|la+kerinleh|timjami|kaneli|(musta.*)?pip+uri|suola+|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste/,
    /wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i/,
    /kokis|kalja|olut|pepsi|mehu/,
    /banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l/,
    /perun(a|oi).*(?!lastu|sipuli)|(?!peruna-)sipuli(?!.*seko)|parsa.*ka+li|pork+ana|sala+t+i|^(?!^wok.*)vihan+ek?s|bata+t+i/,
    /(?!^ko+kos.*)(?:mai[dt]o|kerma)|voi|jogh?urt|hi+va/,
    /(?!^veke)juusto|(koskenlask)?.+dip+i?|hallou?m|cheddar/,
    /liha|kana(?!.*muna)|mifu/,
    /karjalanpa/,
    /kalk+una|kink+u/,
    /pi(?:zz|ts)a|ri+sipi+rak+a/,
    /muna|oli+vi|toma+t+imurska|ananas|ko+kos/,
    /perunalastu|pähkinä|sipsi|hampparikastike/,
    /lei[pv]ä|sämpylä/,
    /nu+deli|makaroni|soija.*r.*h|ri+si|öljy/,
    /vehnäja|muro|mysli/,
    /uncle ben/i,
    /sokeri/,
    /hernek/,
    /suklaa|kark+i/,
    /pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y/,

    // PRISMA:n jälkeen
    /vekeju+sto|loh[ei]/,
];
