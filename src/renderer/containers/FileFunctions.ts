import { JJect, Media } from "./../Models";

export function deleteMedia(oldJSONData: any, selectedMedia: any) {
  if (confirm("Are you sure you want to delete this file?")) {
    if (oldJSONData.media[selectedMedia]) {
      let obj: JJect = {
        media: oldJSONData.media.filter((media: Media) => media != oldJSONData.media[selectedMedia]),
        playlist: oldJSONData.playlist,
        categories: oldJSONData.categories
      };
      return obj;
    }
  }
  return oldJSONData;
}
