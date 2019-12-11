export interface Songs {
  songs: Song[];
}

export interface Song {
  id: number;
  fileName: String;
  filePath: String;
  extension: String;
}

export enum MenuType {
  songs,
  playlists,
  categories
}
