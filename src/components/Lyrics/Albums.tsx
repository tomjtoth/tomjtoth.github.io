import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({ keyA, albums, artist, active }) {
  return (
    <ul>
      {albums.map(([title, { year, url, ...songs }], i) => {
        const keyAA = `${keyA}-album-${i}`;

        return (
          <li
            key={keyAA}
            {...{
              className: `clickable padded bordered${
                albums.length === 1 || active.includes(keyAA) ? " active" : ""
              }`,
              id: keyAA,
            }}
          >
            {year && `${year} - `}
            {title === "null" ? "mix" : title}
            <Logo {...{ url }} />
            <Songs {...{ keyAA, songs, artist, active }} />
          </li>
        );
      })}
    </ul>
  );
}
