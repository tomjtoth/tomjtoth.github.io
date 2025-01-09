import type { AlbumsProps } from "./types";

import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({
  id: idArtist,
  albums,
  artist,
  active,
}: AlbumsProps) {
  return (
    <ul>
      {albums.map(({ title, year, url, songs }, i) => {
        const id = `${idArtist}-album-${i}`;

        return (
          <li
            key={id}
            {...{
              className: `clickable padded bordered${
                albums.length === 1 || active.includes(id) ? " active" : ""
              }`,
              id,
            }}
          >
            {year && `${year} - `}
            {title === "null" ? "mix" : title}
            <Logo {...{ url }} />
            <Songs {...{ albumId: id, songs, artist, active }} />
          </li>
        );
      })}
    </ul>
  );
}
