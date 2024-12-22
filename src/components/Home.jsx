import { Link } from "react-router";
import { header } from "./NavBar";

export default function () {
  return (
    <>
      {header("tomjtoth")}
      <div lang="en">
        <p>
          This site is mostly in Finnish. Here's the link to the{" "}
          <Link
            target="_blank"
            to="https://github.com/tomjtoth/tomjtoth.github.io"
          >
            repo
          </Link>{" "}
          in case you're interested.
        </p>
      </div>
      <div>
        <ul>
          <li>akunvalvonta</li>
          <ul>
            <li>
              yksinkertainen työkalu joka näyttää ilmoituksia jos akun taso ois
              liian ylhäinen tai alhainen
            </li>
          </ul>

          <li>ostoslista</li>
          <ul>
            <li>kasaa ostettavia kamoja minimipanostuksella puoleltani</li>
          </ul>

          <li>låttext</li>
          <ul>
            <li>jag pluggar svenska på min fritid och lyssnar på där låtar</li>
          </ul>
        </ul>

        <h2>Helsingin Yliopistoon liittyvät projektit</h2>
        <ul>
          <li>
            <a href="https://apps.ttj.hu/veripalvelu/">Veripalvelu</a>
            <ul>
              <li>
                repo <a href="https://github.com/tomjtoth/veripalvelu">tässä</a>
              </li>
              <li>pyörii Oraclen ilmaisessa palvelimessa Ruotsissa</li>
              <li lang="en">multithreaded population of fake data</li>
              <li>taustallaa pyörii PostgreSQL ja Flask 🫣</li>
              <li>
                siirretty Docker:iin{" "}
                <a href="https://github.com/tomjtoth/veripalvelu/commit/72adb71c10b75aeb43a72b6e4d2288769550ddae">
                  tässä
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}
