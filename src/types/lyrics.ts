import { Active } from ".";

interface WithHash {
  hash: string;
}

export interface Song extends WithHash {
  title: string;
  lyrics: string;
}

export interface Album extends WithHash {
  title?: string;
  url?: string;
  year?: number;
  songs: Song[];
}

export interface Artist extends WithHash {
  name: string;
  url?: string;
  albums: Album[];
}

interface WithParentHashes {
  parentHashes: string[];
}

export interface AlbumsProps extends WithParentHashes {
  artistIdx: number;
  albums: Album[];
}

export interface SongsProps extends WithParentHashes {
  artistIdx: number;
  albumIdx: number;
  songs: Song[];
}

export type State = {
  artists: Artist[];
  active: Active;
};

export type UseLyrics = {
  artists: Artist[];

  isActive: (id: string) => boolean;
  toggleActive: (id: string) => void;
};
