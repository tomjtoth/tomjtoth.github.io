import { Link } from "react-router";
import yt from "./YouTube.svg";
import gt from "./GoogleTranslate.svg";

export default function ({ url }) {
  return (
    <>
      {url && (
        <Link to={url} target="_blank">
          {/^https:\/\/(?:www\.)?youtube/.test(url) ? (
            <img src={yt} alt="link to YouTube" />
          ) : (
            <img src={gt} alt="link to Google Translate" />
          )}
        </Link>
      )}
    </>
  );
}
