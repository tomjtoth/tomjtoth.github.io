import { ViewHeader, ViewContent } from ".";

type App = {
  title: string;
  desc?: string;
  hy?: boolean;
  prod?: string;
  repo?: string;
  highlights: string[];
};

const APPS: App[] = [
  {
    title: "Saldo",
    highlights: [
      "aloitin tätä Rust:ssa ennen, kuin hain HY:lle, ja se on edelleen kesken",
      "kolmesti uudelleenkirjoitettu, Done:in jälkeen uusi kokeilu Next.js:ssä",
    ],
  },

  {
    title: "Veripalvelu",
    prod: "https://veripalvelu.ttj.hu",
    repo: "https://github.com/tomjtoth/veripalvelu",
    highlights: [
      "multithreaded population of fake data",
      "taustalla pyörii PostgreSQL ja Flask 🫣",
    ],
  },

  {
    title: "Ratebeer",
    prod: "https://ratebeer.ttj.hu",
    repo: "https://github.com/tomjtoth/ratebeer",
    highlights: ["Ruby on Rails"],
  },

  {
    title: "Done",
    prod: "https://done.ttj.hu",
    repo: "https://github.com/tomjtoth/done",
    highlights: [
      "Next.js",
      "sisältää 5 haavoittuvuutta OWASP:in 2021 listalta 🤩",
    ],
  },

  {
    title: "Blogi lista",
    prod: "https://bloglist.ttj.hu",
    repo: "https://github.com/tomjtoth/fullstack-open",
    highlights: ["taustalla mongoDB"],
  },

  {
    title: "Puhelinluettelo",
    prod: "https://puhelinluettelo.ttj.hu",
    repo: "https://github.com/tomjtoth/fullstack-open",
    highlights: ["taustalla mongoDB"],
  },
];

export function Home() {
  return (
    <>
      <ViewHeader title="tervehdys"></ViewHeader>
      <ViewContent className="p-4">
        <div lang="en">
          <h2>Welcome!</h2>
          <p>
            Most of the site is in Finnish, but there are also some parts in
            Hungarian, Swedish and English. Thorough language support is not on
            my TODO list currently, as I speak/study all four. Optimization for
            larger screens is in progress with ultra-low priority (since I
            mostly visit this page from my phone). Check out the{" "}
            <a
              target="_blank"
              href="https://github.com/tomjtoth/tomjtoth.github.io"
            >
              source code
            </a>{" "}
            for all the details.
          </p>
        </div>

        <h2>Sovellukset joissa backend</h2>
        <p>
          Alla sovellukset ovat palautuksia HY:n eri kursseille, laitoin ne
          pyörimään Oracle:n Always Free VPS:ssä Ruotsissa. SSL serti ja
          CNAME:it CloudFlare:ssa kattaa <b>*.ttj.hu</b> ala-domain nimet.
        </p>
        <ul>
          {APPS.map(({ title, prod, repo, highlights }, i) => (
            <li key={i}>
              {prod ? (
                <a {...{ target: "_blank", href: prod }}>{title}</a>
              ) : (
                title
              )}
              {repo && (
                <>
                  {" "}
                  (
                  <a target="_blank" href={repo}>
                    repo
                  </a>
                  )
                </>
              )}
              <ul>
                {highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ViewContent>
    </>
  );
}
