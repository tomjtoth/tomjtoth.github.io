import { Active, PlaybackState } from ".";

export type Quote = {
  quote: string;
  punchline?: string;
  audio?: {
    url: string;
    state: PlaybackState;
  };
  words: number;
};

/// a writer, series or book
export type Data = {
  name: string;
  items: (Data | Quote)[];
  words: number;
};

export type ListProps = {
  indices: number[];
  items: (Data | Quote)[];
};

export type RState = {
  loaded: boolean;
  active: Active;
  wpm: number;
  data: Data[];
};
