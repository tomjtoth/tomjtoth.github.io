import { useAppDispatch, useAppSelector } from "../../hooks";
import { lyricsToggle } from "../../reducers/lyrics";
import type { SongsProps, Artist } from "../../types/lyrics";

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
  const dispatch = useAppDispatch();
  const artists = useAppSelector((s) => s.lyrics.artists);
  const active = useAppSelector((s) => s.lyrics.active);

  return (
    <ul>
      {songs.map(({ title, lyrics }, songIdx) => {
        const id = [artistIdx, albumIdx, songIdx].join("-");
        const classes = ["p-4 border rounded"];
        let clickable = songs.length > 1;
        let link;

        if (lyrics) {
          if (lyrics.startsWith("http")) {
            link = <Logo url={lyrics} />;
            classes.push("cursor-not-allowed");
            clickable = false;
          } else {
            if (clickable) classes.push("clickable");
            link = <Logo url={translate(lyrics)} />;
          }
        } else {
          link = <Logo url={search(artists[artistIdx], title)} />;
          classes.push("cursor-not-allowed");
          clickable = false;
          lyrics = "http";
        }

        return (
          <li
            key={songIdx}
            {...{ className: classes.join(" "), id }}
            onClick={(e) => {
              if (clickable && e.target === e.currentTarget)
                dispatch(lyricsToggle(id));
            }}
          >
            {title}
            {link}
            {!lyrics.startsWith("http") && (
              <p
                className={`whitespace-pre-line select-all cursor-text max-h-0 overflow-hidden m-0${
                  songs.length === 1 || active.includes(id)
                    ? " my-4 px-4 max-h-max"
                    : ""
                }`}
              >
                {lyrics}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
