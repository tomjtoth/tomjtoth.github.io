import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { initVisitors } from "../../reducers/visitors";
import { hideSpinner, showSpinner } from "../../reducers/spinner";

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const pad = (num: number, len = 2) => {
  const padded = `00${num}`;
  return padded.slice(padded.length - len);
};

export default function useLogic() {
  const dispatch = useAppDispatch();
  const next = useAppSelector((s) => s.visitors.next);

  useEffect(() => {
    if (next === undefined) {
      dispatch(showSpinner());
      dispatch(initVisitors()).then(() => {
        buildNode();
        dispatch(hideSpinner());
      });
    } else {
      buildNode();
    }
  }, []);

  useEffect(() => {
    if (next) {
      const id = setInterval(buildNode, 1000);
      return () => clearInterval(id);
    }
  }, [next]);

  const [node, setNode] = useState<React.ReactNode | null>(null);

  function buildNode() {
    setNode(
      (function () {
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
                {name} {pad(DDD * Number(HH))}:{MM}:{SS} múlva
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
      })()
    );
  }

  return node;
}
