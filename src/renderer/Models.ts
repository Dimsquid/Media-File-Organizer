export interface JJect {
  media?: Media[];
  playlist?: Playlist[];
  categories?: Category[];
}

export interface Medias {
  media: Media[];
}

export interface Playlists {
  playlist: Playlists[];
}
export interface Catergories {
  categories: Category[];
}

export interface Playlist {
  id?: number;
  name?: string;
  media?: Media[];
}
export interface Category {
  value: number;
  label: string;
}

export interface Media {
  id?: number;
  fileName?: string;
  filePath?: string;
  extension?: string;
  comment?: string;
  categories?: Category[];
  image?: any;
}

export interface MousePosition {
  top: number;
  left: number;
}

export enum ModalType {
  CreatePlaylist,
  ChooseMediaTypes,
  AddMedia,
  AddMediaToPlaylist,
  EditMediaInfo,
  Null
}
