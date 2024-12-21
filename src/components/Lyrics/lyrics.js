class Lyrics {
  static EMOJI = {
    YOUTUBE: ``,

    TRANSLATE: `
        `,
  };

  static {
    const new_li = (
      txt,
      url = null,
      needs_ul = true,
      lyrics = null,
      title = "open playlist",
      needs_help = false
    ) => {
      // const repl = (txt) => txt.replaceAll(/[^\p{L}\d\/]+/gu, '-');
      const li = document.createElement("li");

      // li.id = repl(parent_node.id + '/' + txt);
      const p = document.createElement("p");
      p.textContent = txt;
      li.appendChild(p);

      if (url) {
        const a = document.createElement("a");
        a.innerHTML = this.EMOJI.YOUTUBE;
        a.href = url;
        a.target = "_blank";
        a.title = title;
        p.appendChild(a);
      }

      if (lyrics) {
        const a = document.createElement("a");
        a.innerHTML = this.EMOJI.TRANSLATE;
        a.href = `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
          lyrics
        )}&op=translate`;
        a.target = "_blank";
        a.title = "open lyrics in Google Translate";
        p.appendChild(a);

        const original_lyrics = document.createElement("ul");
        original_lyrics.textContent = lyrics;
        original_lyrics.style.whiteSpace = "pre-line";
        li.appendChild(original_lyrics);
      }

      if (needs_ul) li.appendChild(document.createElement("ul"));

      if (needs_help) li.classList.add("help-wanted");

      return li;
    };

    const search_on_yt = (artist, song) =>
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(artist + " - Topic " + song);

    const ul_songs = document.querySelector("div#lyrics > ul#songs");

    ul_songs.addEventListener("click", ({ target }) => {
      if (target.tagName !== "P") return;
      target.parentNode.classList.toggle("active");
    });

    // TODO: <a href="link to google translate or no href at all">song name</a><a href="link to youtube">'🎶'</a> 🎤👨‍🎤▶️

    fetch("lyrics.yaml")
      .then((res) => res.text())
      .then((data) => {
        for (const [artist_name, { url, ...albums }] of Object.entries(
          jsyaml.load(data)
        )) {
          const li_artist = new_li(artist_name, url);

          for (const [album_name, { year, url, ...songs }] of Object.entries(
            albums
          ).sort((a, b) => {
            // sortings from latest to oldest albums
            if (typeof a[1].year === "undefined" || a[1].year > b[1].year)
              return -1;
            if (typeof b[1].year === "undefined" || a[1].year < b[1].year)
              return 1;
            return 0;
          })) {
            const li_album = new_li(
              album_name === "null" ? "mix" : album_name + " - " + year,
              url
            );

            for (let [song_name, lyrics] of Object.entries(songs)) {
              let song_url = null,
                song_title,
                song_needs_help = false;

              if (lyrics) {
                if (lyrics.startsWith("http")) {
                  song_url = lyrics;
                  song_title = "open track in YouTube";
                  song_needs_help = true;
                  lyrics = null;
                }
              } else {
                song_url = search_on_yt(artist_name, song_name);
                song_title = "search for the track on YouTube";
                song_needs_help = true;
              }

              li_album.lastChild.appendChild(
                new_li(
                  song_name,
                  song_url,
                  false,
                  lyrics,
                  song_title,
                  song_needs_help
                )
              );
            }
            li_artist.lastChild.appendChild(li_album);
          }
          ul_songs.appendChild(li_artist);
        }

        document
          .querySelectorAll("ul#songs>li>ul>li:only-child")
          .forEach((li) => li.classList.add("active"));
        chg_view(view());
      });
  }
}
