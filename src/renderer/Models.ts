export interface Songs {
  songs: Song[];
}

export interface Song {
  id: number;
  fileName: string;
  filePath: string;
  extension: string;
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
