import MainView from "./MainView";
import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header title="tervehdys"></Header>
      <MainView style={{ padding: 16 }}>
        <p lang="en">
          This site is mostly in Finnish. Here's the link to the{" "}
          <a
            target="_blank"
            href="https://github.com/tomjtoth/tomjtoth.github.io"
          >
            repo
          </a>{" "}
          in case you're interested. Excuse my CSS, I like a color when it's
          hexa looks nice. 🤷‍♂️
        </p>
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
              <li>HY kurssille palautettava</li>
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
              <li>keskeneräinen</li>
              <li>
                sekä backend, että frontend on täällä hetkellä JS:ssa
                kirjoitettu, siirrän ne myöhemmin TS:iin, ja sen jälkeen
                Rust:iin
              </li>
            </ul>
          </li>
        </ul>
      </MainView>
    </>
  );
}
