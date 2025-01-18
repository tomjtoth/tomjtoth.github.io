use super::{Body, Header};
use dioxus::prelude::*;

/// Home page
#[component]
pub fn Home() -> Element {
    rsx! {
      Header { title: &"terve" }

      Body {
        style: Some("padding: 16px;".to_string()),

        p { lang:"en",
          "This site is mostly in Finnish. Here's the link to the "
          a { target:"_blank",
            href: "https://github.com/tomjtoth/tomjtoth.github.io",
            "repo"
          }
          " in case you're interested."
          "Excuse my CSS, I like a color when it's hexa looks nice. 🤷‍♂️"
        }

        h2 { "Sovellukset joissa backend" }
        p { "Nämä alla kaikki pyörivät Oraclen ilmaisessa palvelimessa Ruotsissa." }
        ul {
          li {
            a { target: "_blank",
              href: "https://apps.ttj.hu/veripalvelu",
              "Veripalvelu"
            }
            ul {
              li { "HY kurssille palautettava" }
              li {
                "repo on "
                a { target: "_blank",
                  href: "https://github.com/tomjtoth/veripalvelu",
                  "tässä"
                }
              }
              li { lang:"en",
                  "multithreaded population of fake data"
              }
              li{ "taustallaa pyörii PostgreSQL ja Flask 🫣" }
              li{
                "siirretty Docker:iin "
                a { target:"_blank",
                  href: "https://github.com/tomjtoth/veripalvelu/commit/72adb71c10b75aeb43a72b6e4d2288769550ddae",
                  "tässä"
                }
              }
            }
          }
          li{ "Saldo"
            ul{
              li{"keskeneräinen"}
              li{
                "sekä backend, että frontend on täällä hetkellä JS:ssa kirjoitettu,"
                "siirrän ne myöhemmin TS:iin, ja sen jälkeen Rust:iin"
              }
            }
          }
        }
      }
    }
}
