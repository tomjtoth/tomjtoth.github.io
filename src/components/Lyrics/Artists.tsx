import { useAppSelector } from "../../hooks";
import Albums from "./Albums";
import Logo from "./Logos";

import { Artist } from "./types";

export default function Artists() {
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return (
    <ul lang="sv" id="songs">
      {(artists as Artist[]).map(({ name, url, albums }, i) => {
        const id = `artist-${i}`;

        return (
          <li
            key={id}
            {...{
              className: `clickable padded bordered${
                (active as string[]).includes(id) ? " active" : ""
              }`,
              id,
            }}
          >
            {name}
            <Logo {...{ url }} />
            <Albums {...{ id, albums, artist: name, active }} />
          </li>
        );
      })}
    </ul>
  );
}
