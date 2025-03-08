import { Rune } from "../../types/arx-fatalis/runes";
import useLogic from "./logic";

import { ViewHeader, ViewContent } from "..";
import Controls from "./Controls";
import Img from "./Img";

export function ArxFatalis() {
  const push = useLogic();

  return (
    <>
      <ViewHeader title="riimut">
        <Controls />
      </ViewHeader>
      <ViewContent className="flex flex-col">
        <div className="grow" />
        <div className="grid grid-cols-5 grid-rows-4 gap-[5vmin] max-w-[calc(100vmin-15vmin)] max-h-[calc(100vmin-15vmin)] p-[5vmin] *:w-full *:h-full *:active:animate-rune-glow">
          {Rune.arr.map((rune, i) => (
            <Img
              key={i}
              {...{
                rune,
                onClick: () => push(rune),
              }}
            />
          ))}
        </div>
      </ViewContent>
    </>
  );
}
