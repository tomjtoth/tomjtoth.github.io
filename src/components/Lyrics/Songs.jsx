import { useDispatch } from "react-redux";
import Logo from "./logos";
import factory from "./factory";

const search_on_yt = (artist, song) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${artist} - Topic ${song}`
  )}`;

const translate = (lyrics) =>
  `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
    lyrics
  )}&op=translate`;

export default function ({ keyAA, songs, artist, active }) {
  const dispatch = useDispatch();

  const songs_arr = Object.entries(songs);

  return (
    <ul>
      {songs_arr.map(([title, lyrics], i) => {
        const keyAAS = `${keyAA}-song-${i}`;

        let link;
        let className =
          songs_arr.length === 1 || active.includes(keyAAS) ? "active" : "";

        if (lyrics) {
          if (lyrics.startsWith("http")) {
            link = <Logo url={lyrics} />;
            className += " missing";
          } else {
            link = <Logo url={translate(lyrics)} />;
          }
        } else {
          link = <Logo url={search_on_yt(artist, title)} />;
          className += " missing";
          lyrics = "http";
        }

        if (className === "") className = undefined;

        return (
          <li
            key={keyAAS}
            {...{ className, onClick: factory(dispatch, keyAAS) }}
          >
            <p>
              {title}
              {link}
            </p>
            {!lyrics.startsWith("http") && <ul className="lyrics">{lyrics}</ul>}
          </li>
        );
      })}
    </ul>
  );
}
