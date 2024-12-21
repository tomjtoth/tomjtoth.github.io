export default function () {
  return (
    <>
      <div lang="en">
        <p>
          This site is mostly in Finnish. Here's the link to the
          <a href="https://github.com/tomjtoth/tomjtoth.github.io">repo</a>
          in case you're interested.
        </p>
        {/* <h2>Visitors</h2>
        <p lang="hu" class="biiig">
          Várom, hogy <span title="reptéri mosdó, 1-es fülke...">Bálint</span> +
          a <span title="fényképezz!">dr. NŐ</span>
          meglátogassanak<span id="visitor-text"></span>.
        </p> */}
      </div>
      <div>
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
