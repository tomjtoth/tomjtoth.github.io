import { Link } from "react-router";
import yt from "./YouTube.svg";
import gt from "./GoogleTranslate.svg";

export default function ({ url }) {
  const youtube = true;

  return (
    <>
      {url && (
        <Link to={url}>
          {youtube ? (
            <img src={yt} alt="link to YouTube" />
          ) : (
            <img src={gt} alt="link to Google Translate" />
          )}
        </Link>
      )}
    </>
  );
}
