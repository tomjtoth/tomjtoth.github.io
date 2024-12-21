import { Link } from "react-router";
import "./nav-bar.css";

export default function () {
  return (
    <nav>
      <ul>
        <li className="nav-li">
          <Link to="/about">about</Link>
        </li>
        <li className="nav-li">
          <Link to="/shopping-list">ostoslista</Link>
        </li>
        <li className="nav-li">
          <Link to="/battery-monitor">battery monitor</Link>
        </li>{" "}
        <li className="nav-li">
          <Link to="/lyrics" lang="sv">
            låttext
          </Link>
        </li>
      </ul>
    </nav>
  );
}
