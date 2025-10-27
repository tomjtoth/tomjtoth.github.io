import { useAppDispatch, useAppSelector } from "../../hooks";
import { tLyr } from "../../reducers";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const dispatch = useAppDispatch();
  const artists = useAppSelector((s) => s.lyrics.artists);
  const active = useAppSelector((s) => s.lyrics.active);

  return (
    <ul lang="sv" id="lyrics" className="pl-0 [&_a]:p-2 [&_a]:ml-2">
      {artists.map(({ name, url, albums, hash }, artistIdx) => {
        return (
          <li
            key={hash}
            {...{
              className: `clickable p-4 border rounded${
                active.includes(hash) ? " active" : ""
              }`,
              onClick: (e) => {
                if (e.target === e.currentTarget) dispatch(tLyr.toggle(hash));
              },
            }}
          >
            {name}
            <Logo {...{ url }} />
            <Albums {...{ artistIdx, albums, parentHashes: [hash] }} />
          </li>
        );
      })}
    </ul>
  );
}
