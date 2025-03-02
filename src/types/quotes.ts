import { Active } from ".";

export type Quote = {
  quote: string;
  punchline?: string;
  words: number;
};

/// a writer, series or book
export type Data = {
  name: string;
  items: (Data | Quote)[];
  words: number;
};

export type ListProps = {
  parentId?: string;
  items: (Data | Quote)[];
};

export type RState = {
  loaded: boolean;
  active: Active;
  wpm: number;
  data: Data[];
};
