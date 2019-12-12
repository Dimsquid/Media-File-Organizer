export interface JJect {
  songs?: Song[];
  playlist?: Playlist[];
  categories?: Category[];
}

export interface Songs {
  songs: Song[];
}

export interface Playlists {
  playlist: Playlists[];
}
export interface Categorys {
  categories: Category[];
}

export interface Playlist {
  id?: number;
  name?: string;
  songs?: Song[];
}
export interface Category {
  value: number;
  label: string;
}

export interface Song {
  id?: number;
  fileName?: string;
  filePath?: string;
  extension?: string;
  comment?: string;
  categories?: Category[];
}

export interface MousePosition {
  top: number;
  left: number;
}

export enum ModalType {
  CreatePlaylist,
  ChooseMediaTypes,
  AddSong,
  AddSongToPlaylist,
  EditSongInfo,
  Null
}
