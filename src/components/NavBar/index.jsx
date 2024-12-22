import { Link } from "react-router";
import "./nav-bar.css";

export function header(title) {
  document.title = title;
  return (
    <Link
      className="nav-toggler"
      onClick={(e) => {
        if (e.target.classList.contains("nav-toggler")) {
          document.querySelector("nav.sidenav").classList.toggle("active");
          e.preventDefault();
        }
      }}
    >
      &#x2630; {title}
    </Link>
  );
}

export default function () {
  return (
    <nav className="sidenav">
      <Link to="/">alkuun</Link>
      <Link to="/shopping-list">ostoslista</Link>
      <Link to="/battery-monitor">akunvalvonta</Link>
      <Link to="/lyrics" lang="sv">
        låttext
      </Link>
    </nav>
  );
}
