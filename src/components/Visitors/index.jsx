import { useState, useEffect } from "react";

import Header from "../Header";
import { visits } from "./config";
import "./visitors.css";

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const pad = (num, len = 2) => {
  const padded = `00${num}`;
  return padded.slice(padded.length - len);
};

const re_consonant = /^[bcdfghjklmnpqrstvwxz]/i;

function calc(next) {
  if (!next) return <>nincs új látogató a láthatáron!</>;

  const diff = Math.floor((new Date(next.arrival) - Date.now()) / 1000);
  const DDD = Math.floor(diff / DAY);
  const HH = pad(Math.floor((diff % DAY) / HOUR));
  const MM = pad(Math.floor((diff % HOUR) / MIN));
  const SS = pad(diff % MIN);

  const coming = `${next.who.includes("+") ? "Jönnek" : "Jön"} ${
    re_consonant.test(next.who) ? "a" : "az"
  } `;

  if (DDD <= 3)
    return (
      <span className="hu">
        {coming}
        {next.who} {pad(DDD * Number(HH))}:{MM}:{SS} múlva
      </span>
    );

  if (DDD < 7)
    return (
      <>
        {coming}
        <span className="hu">
          {next.who} {DDD} nap
        </span>{" "}
        {HH}:{MM}:{SS} múlva
      </>
    );

  return (
    <>
      {coming}
      <span className="hu">{next.who}</span> {DDD} nap {HH}:{MM}:{SS} múlva
    </>
  );
}

export default function () {
  const next = visits.find((v) => Date.now() < new Date(v.arrival));
  const [child, setChild] = useState(calc(next));

  useEffect(() => {
    if (next) {
      const id = setInterval(() => {
        setChild(calc(next));
      }, 1000);
      return () => clearInterval(id);
    }
  }, []);

  return (
    <Header lang="hu" title="látogatók">
      <div id="next-visitor">{child}</div>
    </Header>
  );
}
