use dioxus::logger::tracing;
use fancy_regex::Regex;
use once_cell::sync::Lazy;

pub static RE_ORDER: Lazy<Vec<Regex>> = Lazy::new(|| {
    let res = [
        // ennen PRISMA:a
        r"(cit+ari|K-supermarket|K-cit[iy]market)(?::sta)?",
        r"Tokmann?i",
        r"\bLIDL\b",
        
        // PRISMA:sta
        r"hammas(?:lan(?:ka|gai)|tahn|tikk)",
        r"rosmari+ni|pi(ts|zz)amaus|la+kerinleh|timjami|kaneli|(musta.*)?pip+uri(?!.*juusto)|suola+|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste",
        r"wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i|rusin(?:oi|a)",
        r"leivinpaperi|alumiinifolio|servetti",
        r"kokis|kalja|olu[et]|pepsi|mehu",
        r"(?:talous|vessa|p(?:\*+|a)ska)paperi",
        r"banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l",
        r"(?<!peruna-)sipuli|perun(a|oi)(?!.*(?:lastu|sipuli))|parsa.*ka+li|pork+ana|sala+t+i|^(?!^wok.*)vihan+ek?s|bata+t+i|tomaatti(?!.*murska)|paprika",
        r"(?!^ko+kos.*)(?:mai[dt]o|kerma)|voi|jogh?urt|hi+va|creme fraiche",
        r"(?!^veke)juusto|(koskenlask)?.+dip+i?|hallou?m|cheddar",
        r"liha|kana(?!.*muna)|mifu|possu.*suikale",
        r"\b(?:kirjo)?loh(?:i|en|ta)\b",
        r"karjalanpa",
        r"kalk+una|kink+u",
        r"pi(?:zz|ts)a|ri+sipi+rak+a",
        r"muna|oliivi|tomaattimurska|ananas|kookosmai[dt]o|pikkukurkut",
        r"perunalastu|pähkinä|sipsi|hampparikastike",
        r"lei[pv]ä|sämpylä",
        r"nu+deli|makaroni|soija.*r.*h|ri+si|öljy",
        r"vehnäja|muro|mysli",
        r"uncle ben",
        r"sokeri",
        r"hernek",
        r"suklaa|kark+i",
        r"pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y",
        
        // HESBURGER
        r"vekeju+sto",
    ].into_iter().map(|patt| {
      Regex::new(patt).unwrap()
    }).collect::<Vec<Regex>>();

    tracing::debug!("compiled ~30 fancy-regexes");

    res
});
