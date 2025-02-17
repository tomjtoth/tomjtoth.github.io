import useCV from "../../hooks/cv";
// import SVGs from "./svgs";

export default function Personal() {
  const { cv, img } = useCV();

  let details = null;

  if (cv) {
    const p = cv.personal;
    document.title = `CV of ${p.lastname}, ${p.firstname}`;

    // const { phone, mail, pin, flags, cake } = SVGs();

    details = (
      <div>
        <div style={{ textAlign: "center" }}>
          <b>{p.firstname.toUpperCase()}</b>{" "}
          <span className="cv-lastname">{p.lastname.toUpperCase()}</span>
        </div>
        <ul className="cv-personal-data">
          <li data-icon="📞">
            <a href={`tel:${p.phone}`}>{p.phone}</a>
          </li>
          <li data-icon="✉️">
            <a href={`mailto:${p.email}`}>{p.email}</a>
          </li>
          <li data-icon="📍">{p.location}</li>
          {p.cship.map(([flag, nat], i) => (
            <li data-icon={flag} key={i}>
              {nat}
            </li>
          ))}
          <li data-icon="🎂">{p.born}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="border1-e cv-personal-container">
      <img src={img} className="cv-profile-pic" alt="profile picture" />
      {details}
    </div>
  );
}
