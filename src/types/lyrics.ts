import { Active } from ".";

export type Song = {
  title: string;
  lyrics: string;
};

export type Album = {
  title?: string;
  url?: string;
  year?: number;
  songs: Song[];
};

export type Artist = {
  name: string;
  url?: string;
  albums: Album[];
};

export type AlbumsProps = {
  artistIdx: number;
  albums: Album[];
};

export type SongsProps = {
  artistIdx: number;
  albumIdx: number;
  songs: Song[];
};

export type State = {
  artists: Artist[];
  active: Active;
};

export type UseLyrics = {
  artists: Artist[];

  isActive: (id: string) => boolean;
  toggleActive: (id: string) => void;
};
