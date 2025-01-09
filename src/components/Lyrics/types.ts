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
  id: string;
  albums: Album[];
  artist: string;
  active: string[];
};

export type SongsProps = {
  albumId: string;
  songs: Song[];
  artist: string;
  active: string[];
};
