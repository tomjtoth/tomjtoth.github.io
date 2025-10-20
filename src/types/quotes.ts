import { Active, PlaybackState } from ".";

export type Quote = (
  | {
      quote: string;
    }
  | {
      innerHTML: string;
    }
) & {
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
