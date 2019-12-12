import { JJect, Song } from "./../Models";

export function deleteSong(oldJSONData: any, selectedSong: any) {
  if (confirm("Are you sure you want to delete this file?")) {
    if (oldJSONData.songs[selectedSong]) {
      let obj: JJect = {
        songs: oldJSONData.songs.filter((song: Song) => song != oldJSONData.songs[selectedSong]),
        playlist: oldJSONData.playlist,
        categories: oldJSONData.categories
      };
      return obj;
    }
  }
  return oldJSONData;
}
