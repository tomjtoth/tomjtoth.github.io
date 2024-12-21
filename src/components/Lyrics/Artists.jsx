import Albums from "./Albums";
import Logo from "./logos";

export default function ({ data }) {
  return (
    <ul lang="sv">
      {Object.entries(data)
        .toSorted(([artist_a], [artist_b]) => {
          const lower_a = artist_a.toLowerCase();
          const lower_b = artist_b.toLowerCase();

          if (lower_a < lower_b) return -1;
          if (lower_a > lower_b) return 1;
          return 0;
        })
        .map(([artist, { url, ...albums }], i) => {
          const keyA = `artist-${i}`;

          return (
            <li key={keyA}>
              {artist}
              <Logo {...{ url }} />
              <Albums {...{ keyA, albums }} />
            </li>
          );
        })}
    </ul>
  );
}
