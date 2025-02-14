import { RedState } from "../../types/cv";

export default function Personal({ cv: { personal: p }, img }: RedState) {
  return (
    <>
      <h2>
        <b>Personal details</b>
      </h2>
      <ul className="personal">
        <li>
          Phone: <span>{p.phone}</span>
        </li>
        <li>
          Email: <span>{p.email}</span>
        </li>
        <li>
          City of residence: <span>{p.residence}</span>
        </li>
        <li>
          Born: <span>{p.born}</span>
        </li>
        <li>
          Nationality: <span>{p.nationality}</span>
        </li>
        <li>
          Sex: <span>{p.sex}</span>
        </li>
      </ul>
      <img
        src={img}
        alt="profile picture"
        style={{ maxWidth: "3cm", maxHeight: "5cm" }}
      />
    </>
  );
}
