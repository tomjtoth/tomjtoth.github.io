import { useSpinner, useAppSelector } from "../../hooks";

import { ViewHeader, ViewContent, CxMediaControlsPadding } from "..";
import { List } from "./List";
import Controls from "./Controls";

export function Quotes() {
  const items = useAppSelector((s) => s.quotes.data);
  const loaded = useAppSelector((s) => s.quotes.loaded);
  useSpinner(loaded);

  return (
    <CxMediaControlsPadding.Provider value={false}>
      <ViewHeader title="Sitaatit">
        <Controls />
      </ViewHeader>
      <ViewContent>
        <p className="p-2 sm:p-4">
          Keräsin tähän näkymään muutaman sitaatin joista tykkäsin. Miun{" "}
          <a href="https://goodreads.com/tomjtoth" target="_blank">
            Goodreads profiilista
          </a>{" "}
          pääsee käsiksi lukemieni kirjoihin. Alla listassa näkyy myös
          estimaatit jokaisen kappaleen kohdalla lukuajasta.
        </p>
        <List {...{ items, hashes: [] }} />
      </ViewContent>
    </CxMediaControlsPadding.Provider>
  );
}
