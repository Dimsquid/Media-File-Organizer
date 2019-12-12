import { Playlists } from "./Models";
export interface JJect {
  playlist?: Playlist[];
}

export interface Songs {
  songs: Song[];
}

export interface Playlists {
  playlist: Playlists[];
}

export interface Playlist {
  id?: number;
  name?: string;
  songs?: Song[];
}

export interface Song {
  id?: number;
  fileName?: string;
  filePath?: string;
  extension?: string;
  comment?: string;
}

export interface MousePosition {
  top: number;
  left: number;
}

export enum MenuType {
  songs,
  playlists,
  categories
}
