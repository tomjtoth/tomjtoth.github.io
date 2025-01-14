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

export type Active = string[];

export type State = {
  artists: Artist[];
  active: Active;
};
