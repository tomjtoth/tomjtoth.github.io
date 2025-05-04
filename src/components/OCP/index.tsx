import { useLocation } from "react-router";

export function OCP() {
  const { search } = useLocation();
  const imps = new URLSearchParams(search).get("import");
  console.log(imps);

  return (
    <>
      <p>WiP, open console</p>
      {/* <p>name: {usp.get("name")}</p>
      <p>race: {usp.get("race")}</p>
      <p>gender: {usp.get("gender")}</p>
      <p>birthsign: {usp.get("birthsign")}</p>
      <p>specialization: {usp.get("specialization")}</p>
      <p>className: {usp.get("className")}</p> */}
    </>
  );
}
