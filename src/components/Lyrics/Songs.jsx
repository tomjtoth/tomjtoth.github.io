import Logo from "./logos";

export default function ({ keyAA, songs }) {
  return (
    <ul>
      {Object.entries(songs).map(([title, lyrics], i) => {
        const key = `${keyAA}-song-${i}`;

        return <li {...{ key }}>{lyrics}</li>;
      })}
    </ul>
  );
}
