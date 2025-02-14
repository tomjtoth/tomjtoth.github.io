import useCV from "../../hooks/cv";
import Logos from "./svgs";

export default function Personal() {
  const { cv, img } = useCV();

  let details = null;

  if (cv) {
    const p = cv.personal;

    const [svgPhone, svgMail, svgLocation] = Logos();

    details = (
      <div style={{ paddingTop: 16 }}>
        <div>
          <span>
            <b>{p.firstname.toUpperCase()}</b>
          </span>{" "}
          <span className="cv surname">{p.surname.toUpperCase()}</span>
        </div>
        <ul className="cv personal">
          <li>
            {svgPhone} <span className="left-padded">{p.phone}</span>
          </li>
          <li>
            {svgMail} <span className="left-padded">{p.email}</span>
          </li>
          <li>
            {svgLocation} <span className="left-padded">{p.residence}</span>
          </li>
          {/* <li>
          Born: <span>{p.born}</span>
        </li>
        <li>
          Nationality: <span>{p.nationality}</span>
        </li>
        <li>
          Sex: <span>{p.sex}</span>
        </li> */}
        </ul>
      </div>
    );
  }

  return (
    <div className="border1-e cv personal-container">
      <img
        src={img}
        alt="profile picture"
        style={{ maxWidth: "3cm", maxHeight: "5cm" }}
      />
      {details}
    </div>
  );
}
