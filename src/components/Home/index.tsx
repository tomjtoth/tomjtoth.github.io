import { ViewHeader, ViewContent } from "..";
import APPS_DATA from "./apps.yaml";

type Apps = {
  [title: string]: {
    desc?: string;
    prod?: string;
    repo?: string;
    highlights: string[];
  };
};

const APPS: Apps = APPS_DATA;

const RE_TITLE_SPLITTER = /^(\p{Emoji}) (.+)/u;

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
        <ul className="[&>*+*]:mt-2 [&>li]:marker:content-[attr(data-marker)]">
          {Object.entries(APPS).map(
            ([title, { desc, prod, repo, highlights }]) => {
              const [_, emoji, strTitle] = title.split(RE_TITLE_SPLITTER);

              return (
                <li key={title} data-marker={emoji + "\u00A0"}>
                  {prod ? (
                    <a {...{ target: "_blank", href: prod }}>{strTitle}</a>
                  ) : (
                    <h3>title</h3>
                  )}
                  {(repo || desc) && (
                    <>
                      {" "}
                      ({desc && <>{desc} - </>}
                      repo{" "}
                      <a target="_blank" href={repo}>
                        tässä
                      </a>
                      )
                    </>
                  )}
                  <ul>
                    {highlights.map((point, i) => (
                      <li key={i} data-marker="✓&nbsp;">
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            },
          )}
        </ul>
      </ViewContent>
    </>
  );
}
