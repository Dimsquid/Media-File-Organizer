import { Songs } from "../../Models";
var fs = require("fs");

export enum ActionTypes {
  MEDIA_RECEIVED = "[Media] MEDIA_RECEIVED",
  MEDIA_REQUEST = "[Media] MEDIA_REQUEST"
}

export interface MediaRequest {
  type: ActionTypes.MEDIA_REQUEST;
}

export interface MediaReceived {
  type: ActionTypes.MEDIA_RECEIVED;
  payload: {
    globals: Songs;
  };
}

function loadInCurrentSongList() {
  return new Promise(resolve => {
    var obj: Songs = {
      songs: []
    };
    fs.readFile("saveFile.json", "utf-8", (err: any, data: any) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        resolve(obj);
        return;
      }
      const newData = JSON.parse(data);
      if (newData.songs.length > 0) {
        newData.songs.map((song: any) => {
          obj.songs.push(song);
        });
      }
    });
    resolve(obj);
  });
}

export function mediaReceived(json: any): MediaReceived {
  return {
    type: ActionTypes.MEDIA_RECEIVED,
    payload: {
      globals: json
    }
  };
}

export function mediaRequest(): MediaRequest {
  return {
    type: ActionTypes.MEDIA_REQUEST
  };
}

export function receiveMedia() {
  return function(dispatch: Function) {
    dispatch(mediaRequest());
    setTimeout(function() {
      loadInCurrentSongList().then(songList => {
        dispatch(mediaReceived(songList));
      });
    }, 2500);
  };
}

export type Action = MediaReceived | MediaRequest;
