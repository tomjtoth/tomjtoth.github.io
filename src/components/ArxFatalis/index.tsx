import { IS_TOUCH_DEVICE } from "../../utils";
import { Rune } from "../../types/arx-fatalis/runes";
import useLogic from "./logic";

import { ViewHeader, ViewContent, CxMediaControlsPadding } from "..";
import Controls from "./Controls";
import Img from "./Img";

export function ArxFatalis() {
  const push = useLogic();

  return (
    <CxMediaControlsPadding.Provider value={false}>
      <ViewHeader title="riimut">
        <Controls />
      </ViewHeader>
      <ViewContent className="flex flex-col">
        {!IS_TOUCH_DEVICE && (
          <p className="mx-2 text-center">
            This could be much easier on a touch device..
          </p>
        )}
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
    </CxMediaControlsPadding.Provider>
  );
}
