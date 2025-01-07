import Logo from "./Logos";

const search_on_yt = (artist, song) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${artist} - Topic ${song}`
  )}`;

const translate = (lyrics) =>
  `https://translate.google.com/?sl=sv&tl=en&text=${encodeURIComponent(
    lyrics
  )}&op=translate`;

export default function Songs({ keyAA, songs, artist, active }) {
  const songs_arr = Object.entries(songs);

  return (
    <ul>
      {songs_arr.map(([title, lyrics], i) => {
        const keyAAS = `${keyAA}-song-${i}`;

        let link;
        let className = `padded bordered${
          songs_arr.length === 1 || active.includes(keyAAS) ? " active" : ""
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
          <li key={keyAAS} {...{ className, id: keyAAS }}>
            {title}
            {link}
            {!lyrics.startsWith("http") && <p className="lyrics">{lyrics}</p>}
          </li>
        );
      })}
    </ul>
  );
}
