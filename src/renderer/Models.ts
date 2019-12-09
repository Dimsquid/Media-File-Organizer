export interface Songs {
  songs: [
    {
      id: number;
      fileName: String;
      filePath: String;
      extension: String;
      //   Comment: String;
    }
  ];
}

export interface SongList {
  Songs: { songs: Songs[] };
}

export enum MenuType {
  songs,
  playlists,
  categories
}
