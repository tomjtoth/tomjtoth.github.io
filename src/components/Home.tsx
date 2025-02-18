import ViewContent from "./ViewContent";
import ViewHeader from "./ViewHeader";

export default function Home() {
  return (
    <>
      <ViewHeader title="tervehdys"></ViewHeader>
      <ViewContent style={{ padding: 16 }}>
        <div lang="en">
          <h2>DISCLAIMER</h2>
          <p>
            This site is mostly in Finnish and there are some views in
            Hungarian, Swedish and English. Here's the link to the{" "}
            <a
              target="_blank"
              href="https://github.com/tomjtoth/tomjtoth.github.io"
            >
              repo
            </a>{" "}
            in case you're interested. The{" "}
            <b>CV view is most suitable on a laptop</b> , since it's hard-coded
            for a single A4, and I recommend trying out the{" "}
            <b>Arx Fatalis minigame on a phone</b>. 🤓 Optimization for
            different devices is and will be a constant TODO.. 🫣 Also excuse my
            CSS, I like a color when it's hexa looks nice. 🤷‍♂️
          </p>
        </div>

        <h2>Sovellukset joissa backend</h2>
        <p>
          Nämä alla kaikki pyörivät Oraclen ilmaisessa palvelimessa Ruotsissa.
        </p>
        <ul>
          <li>
            <a target="_blank" href="https://apps.ttj.hu/veripalvelu">
              Veripalvelu
            </a>
            <ul>
              <li>HY:n kurssille palautettu tehtävä</li>
              <li>
                repo on{" "}
                <a
                  target="_blank"
                  href="https://github.com/tomjtoth/veripalvelu"
                >
                  tässä
                </a>
              </li>
              <li lang="en">multithreaded population of fake data</li>
              <li>taustallaa pyörii PostgreSQL ja Flask 🫣</li>
              <li>
                siirretty Docker:iin{" "}
                <a
                  target="_blank"
                  href="https://github.com/tomjtoth/veripalvelu/commit/72adb71c10b75aeb43a72b6e4d2288769550ddae"
                >
                  tässä
                </a>
              </li>
            </ul>
          </li>
          <li>
            Saldo
            <ul>
              <li>tuleva projekti</li>
              <li>
                tavoitteena kirjata se nextJS:ään, sit toivottavasti siirryn
                myöhemmin Dioxus:iin (Rust + WASM)
              </li>
            </ul>
          </li>
        </ul>
      </ViewContent>
    </>
  );
}
