import { useDispatch } from "react-redux";
import Albums from "./Albums";
import Logo from "./logos";
import factory from "./factory";

export default function ({ artists, active }) {
  const dispatch = useDispatch();

  return (
    <ul
      lang="sv"
      id="songs"
      // onClick={({ target }) => {
      //   if (target.tagName !== "P") return;
      //   target.parentNode.classList.toggle("active");
      //   // dispatch();
      // }}
    >
      {Object.entries(artists)
        .toSorted(([artist_a], [artist_b]) => {
          const lower_a = artist_a.toLowerCase();
          const lower_b = artist_b.toLowerCase();

          if (lower_a < lower_b) return -1;
          if (lower_a > lower_b) return 1;
          return 0;
        })
        .map(([artist, { url, ...albums }], i) => {
          const keyA = `artist-${i}`;
          const className = active.includes(keyA) ? "active" : undefined;

          return (
            <li key={keyA} {...{ className }} onClick={factory(dispatch, keyA)}>
              <p>
                {artist}
                <Logo {...{ url }} />
              </p>
              <Albums {...{ keyA, albums, artist, active }} />
            </li>
          );
        })}
    </ul>
  );
}
