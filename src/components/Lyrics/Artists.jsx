import Albums from "./Albums";
import Logo from "./logos";

export default function ({ artists, active }) {
  return (
    <ul lang="sv" id="songs">
      {artists.map(([artist, { url, albums }], i) => {
        const keyA = `artist-${i}`;

        return (
          <li
            key={keyA}
            {...{
              className: `clickable padded bordered${
                active.includes(keyA) ? " active" : ""
              }`,
              id: keyA,
            }}
          >
            {artist}
            <Logo {...{ url }} />
            <Albums {...{ keyA, albums, artist, active }} />
          </li>
        );
      })}
    </ul>
  );
}
