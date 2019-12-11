import { Songs } from "../../Models";
import { Action, ActionTypes } from "./Actions";
const data = require("../../../saveFolder/saveFile.json");

export interface State {
  songs: Songs | null;
  fetching: boolean;
}

export const initialState: State = {
  songs: data,
  fetching: false
};

export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.MEDIA_REQUEST:
      return {
        songs: data,
        fetching: true
      };
    case ActionTypes.MEDIA_RECEIVED:
      return {
        songs: action.payload.globals,
        fetching: false
      };
    default:
      return state;
  }
}
