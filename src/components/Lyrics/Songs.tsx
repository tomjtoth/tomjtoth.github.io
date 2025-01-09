import type { SongsProps } from "./types";
import Logo from "./Logos";

const search_on_yt = (artist: string, song: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${artist} - Topic ${song}`
  )}`;

const translate = (lyrics: string) =>
  `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
    lyrics
  )}&op=translate`;

export default function Songs({ albumId, songs, artist, active }: SongsProps) {
  return (
    <ul>
      {songs.map(({ title, lyrics }, i) => {
        const id = `${albumId}-song-${i}`;

        let link;
        let className = `padded bordered${
          songs.length === 1 || active.includes(id) ? " active" : ""
        }`;

        if (lyrics) {
          if (lyrics.startsWith("http")) {
            link = <Logo url={lyrics} />;
            className += " missing-lyrics";
          } else {
            link = <Logo url={translate(lyrics)} />;
          }
        } else {
          link = <Logo url={search_on_yt(artist, title)} />;
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
