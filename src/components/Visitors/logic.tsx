import { useEffect, useState } from "react";

import { useSpinner, useAppSelector } from "../../hooks";
import { pad } from "../../utils";

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function calc(next: any) {
  if (next) {
    const { epoch, name, opening } = next;

    const diff = Math.floor((epoch - Date.now()) / 1000);
    const DDD = Math.floor(diff / DAY);
    const HH = pad(Math.floor((diff % DAY) / HOUR));
    const MM = pad(Math.floor((diff % HOUR) / MIN));
    const SS = pad(diff % MIN);

    const cn = "animate-visitors-hu";

    if (DDD <= 3)
      return (
        <span className={cn}>
          {opening}
          {name} {pad(DDD >= 1 ? DDD * Number(HH) : HH)}:{MM}:{SS} múlva
        </span>
      );

    if (DDD < 7)
      return (
        <>
          {opening}
          <span className={cn}>
            {name} {DDD} nap
          </span>{" "}
          {HH}:{MM}:{SS} múlva
        </>
      );

    return (
      <>
        {opening}
        <span className={cn}>{name}</span> {DDD} nap {HH}:{MM}:{SS} múlva
      </>
    );
  }

  return <>nincs új látogató a láthatáron!</>;
}

export default function useLogic() {
  const next = useAppSelector((s) => s.visitors.next);
  const [node, setNode] = useState<React.ReactNode>(calc(next));
  useSpinner(next !== undefined);

  useEffect(() => {
    if (next) {
      setNode(calc(next));
      const id = setInterval(() => setNode(calc(next)), 1000);
      return () => clearInterval(id);
    }
  }, [next]);

  return node;
}
