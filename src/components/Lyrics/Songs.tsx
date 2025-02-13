import type { SongsProps, Artist } from "../../types/lyrics";
import useLyrics from "../../hooks/lyrics";

import Logo from "./Logos";

function search({ name }: Artist, song: string) {
  const encoded = encodeURIComponent(`${name} - Topic ${song}`);
  return `https://www.youtube.com/results?search_query=${encoded}`;
}

function translate(lyrics: string) {
  const encoded = encodeURIComponent(lyrics);
  return `https://translate.google.com/?sl=sv&tl=en&text=${encoded}&op=translate`;
}

export default function Songs({ artistIdx, albumIdx, songs }: SongsProps) {
  const { artists, isActive, toggleActive } = useLyrics();

  return (
    <ul>
      {songs.map(({ title, lyrics }, songIdx) => {
        const id = [artistIdx, albumIdx, songIdx].join("-");
        const classes = ["padded bordered"];
        let clickable = songs.length > 1;
        if (songs.length === 1 || isActive(id)) classes.push("active");

        let link;

        if (lyrics) {
          if (lyrics.startsWith("http")) {
            link = <Logo url={lyrics} />;
            classes.push("clicking-not-allowed");
            clickable = false;
          } else {
            if (clickable) classes.push("clickable");
            link = <Logo url={translate(lyrics)} />;
          }
        } else {
          link = <Logo url={search(artists[artistIdx], title)} />;
          classes.push("clicking-not-allowed");
          clickable = false;
          lyrics = "http";
        }

        return (
          <li
            key={songIdx}
            {...{ className: classes.join(" "), id }}
            onClick={(e) => {
              if (clickable && e.target === e.currentTarget) toggleActive(id);
            }}
          >
            {title}
            {link}
            {!lyrics.startsWith("http") && <p className="lyrics">{lyrics}</p>}
          </li>
        );
      })}
    </ul>
  );
}
