import { Active, PlaybackState } from ".";

interface Common {
  hash: string;
  words: number;
}

interface QuoteBase extends Common {
  punchline?: string;
  audio?: {
    url: string;
    state: PlaybackState;
  };
}

export type Quote = QuoteBase & ({ quote: string } | { innerHTML: string });

/// a writer, series or book
export interface Data extends Common {
  name: string;
  items: (Data | Quote)[];
}

export type ListProps = {
  hashes: string[];
  items: (Data | Quote)[];
};

type Playback = {
  state: PlaybackState;
  currentTime: number;
  duration: number;
};

export type RState = {
  loaded: boolean;
  playback: Playback;
  active: Active;
  wpm: number;
  data: Data[];
};
