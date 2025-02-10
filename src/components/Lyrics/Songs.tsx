import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleSelection } from "../../reducers/lyrics";
import type { SongsProps, Artist } from "../../types/lyrics";

import Logo from "./Logos";

const search = ({ name }: Artist, song: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${name} - Topic ${song}`
  )}`;

const translate = (lyrics: string) =>
  `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
    lyrics
  )}&op=translate`;

export default function Songs({ artistIdx, albumIdx, songs }: SongsProps) {
  const dispatch = useAppDispatch();
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return (
    <ul>
      {songs.map(({ title, lyrics }, songIdx) => {
        const id = [artistIdx, albumIdx, songIdx].join("-");
        const classes = ["padded bordered"];
        let clickable = songs.length > 1;
        if (songs.length === 1 || active.includes(id)) classes.push("active");

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
              if (clickable && e.target === e.currentTarget)
                dispatch(toggleSelection(id));
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
