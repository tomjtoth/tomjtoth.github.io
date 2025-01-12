import { useAppSelector } from "../../hooks";
import { Artist } from "./types";
import { idxOf } from "../../utils";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return (
    <ul lang="sv" id="songs">
      {(artists as Artist[]).map(({ name, url, albums }, artistIdx) => {
        const idArr = [artistIdx];
        const id = idArr.join();

        return (
          <li
            key={id}
            {...{
              className: `clickable padded bordered${
                idxOf(active, idArr) > -1 ? " active" : ""
              }`,
              id,
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
