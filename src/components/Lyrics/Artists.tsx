import { useAppSelector } from "../../hooks";
import { Active } from "../../types/common";
import { Artist } from "../../types/lyrics";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return (
    <ul lang="sv" id="songs">
      {(artists as Artist[]).map(({ name, url, albums }, artistIdx) => {
        const id = [artistIdx].join();

        return (
          <li
            key={artistIdx}
            {...{
              id,
              className: `clickable padded bordered${
                (active as Active).includes(id) ? " active" : ""
              }`,
            }}
          >
            {name}
            <Logo {...{ url }} />
            <Albums {...{ artistIdx, albums }} />
          </li>
        );
      })}
    </ul>
  );
}
