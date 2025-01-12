import { useAppSelector } from "../../hooks";
import type { SongsProps, Artist } from "./types";
import { idxOf } from "../../utils";

import Logo from "./Logos";

const search_on_yt = (artist: string, song: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${artist} - Topic ${song}`
  )}`;

const translate = (lyrics: string) =>
  `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
    lyrics
  )}&op=translate`;

export default function Songs({ artistIdx, albumIdx, songs }: SongsProps) {
  const { artists, active } = useAppSelector((s) => s.lyrics);
  return (
    <ul>
      {songs.map(({ title, lyrics }, songIdx) => {
        const idArr = [artistIdx, albumIdx, songIdx];

        const id = idArr.join("-");

        let link;
        let className = `padded bordered${
          songs.length === 1 || idxOf(active, idArr) > -1 ? " active" : ""
        }`;

        if (lyrics) {
          if (lyrics.startsWith("http")) {
            link = <Logo url={lyrics} />;
            className += " missing-lyrics";
          } else {
            className += " clickable";
            link = <Logo url={translate(lyrics)} />;
          }
        } else {
          link = (
            <Logo
              url={search_on_yt((artists[artistIdx] as Artist).name, title)}
            />
          );
          className += " missing-lyrics";
          lyrics = "http";
        }

        return (
          <li key={id} {...{ className, id }}>
            {title}
            {link}
            {!lyrics.startsWith("http") && <p className="lyrics">{lyrics}</p>}
          </li>
        );
      })}
    </ul>
  );
}
