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
    prod: "https://saldo.ttj.hu",
    repo: "https://github.com/tomjtoth/saldo",
    highlights: [
      "Next.js",
      "Auth.js",
      "Drizzle-ORM",
      "SQLite",
      "Tailwind CSS",
      "Cypress",
    ],
  },

  {
    title: "Veripalvelu",
    prod: "https://veripalvelu.ttj.hu",
    repo: "https://github.com/tomjtoth/veripalvelu",
    hy: true,
    highlights: [
      "multithreaded population of fake data",
      "taustalla pyörii PostgreSQL ja Flask 🫣",
    ],
  },
];

export function Home() {
  return (
    <>
      <ViewHeader title="sovellukset"></ViewHeader>
      <ViewContent className="p-4">
        <div lang="en">
          <h2>Welcome!</h2>
          <p>
            This site is a collection of client-side tools/miniapps for my
            personal use. Most of them are in Finnish, but there are also some
            in Hungarian, Swedish and English. A unified language support is
            currently unplanned, as I speak/study all four languages, hence the
            diversity. An experimental rewrite was started in Rust using Dioxus,
            and will probably be continued some day. Check out the{" "}
            <a
              target="_blank"
              href="https://github.com/tomjtoth/tomjtoth.github.io"
            >
              source code
            </a>{" "}
            for all the details.
          </p>
        </div>

        <h2 id="apps">Sovellukset joissa backend</h2>
        <p>Alla sovellukset pyörivät minun k3s klusterissa Ruotsissa.</p>
        <ul>
          {APPS.map(({ title, prod, repo, highlights, hy }, i) => (
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
                {hy && <li>on palautettava tehtävä HY:n kurssille</li>}
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
