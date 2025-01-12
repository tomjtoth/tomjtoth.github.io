export const re = {
  recipeId: /^rec(?<recId>\d+)$/,
  emptyString: /^\s*$/,
  order: [
    // ennen PRISMA:a
    /(cit+ari|K-supermarket|K-cit[iy]market)(?::sta)?/i,
    /[Tt]okmann?i/,
    /\bLIDL\b/,

    // PRISMA:sta
    /hammas(?:lan(?:ka|gai)|tahn|tikk)/i,
    /rosmari+ni|pi(ts|zz)amaus|la+kerinleh|timjami|kaneli|(musta.*)?pip+uri(?!.*juusto)|suola+|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste/i,
    /wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i|rusin(?:oi|a)/i,
    /leivinpaperi|alumiinifolio|servetti/i,
    /kokis|kalja|olu[et]|pepsi|mehu/i,
    /(?:talous|vessa|p(?:\*+|a)ska)paperi/i,
    /banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l/i,
    /(?<!peruna-)sipuli|perun(a|oi)(?!.*(?:lastu|sipuli))|parsa.*ka+li|pork+ana|sala+t+i|^(?!^wok.*)vihan+ek?s|bata+t+i|tomaatti(?!.*murska)|paprika/i,
    /(?!^ko+kos.*)(?:mai[dt]o|kerma)|voi|jogh?urt|hi+va|creme fraiche/i,
    /(?!^veke)juusto|(koskenlask)?.+dip+i?|hallou?m|cheddar/i,
    /liha|kana(?!.*muna)|mifu|possu.*suikale/i,
    /\b(?:kirjo)?loh(?:i|en|ta)\b/i,
    /karjalanpa/i,
    /kalk+una|kink+u/i,
    /pi(?:zz|ts)a|ri+sipi+rak+a/i,
    /muna|oliivi|tomaattimurska|ananas|kookosmai[dt]o|pikkukurkut/i,
    /perunalastu|pähkinä|sipsi|hampparikastike/i,
    /lei[pv]ä|sämpylä/i,
    /nu+deli|makaroni|soija.*r.*h|ri+si|öljy/i,
    /vehnäja|muro|mysli/i,
    /uncle ben/i,
    /sokeri/i,
    /hernek/i,
    /suklaa|kark+i/i,
    /pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y/i,

    // HESBURGER
    /vekeju+sto/i,
  ],
};
