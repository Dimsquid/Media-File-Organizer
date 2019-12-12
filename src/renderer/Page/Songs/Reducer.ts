import { Songs } from "../../Models";
import { Action, ActionTypes } from "./Actions";

export interface State {
  songs: Songs | null;
  fetching: boolean;
}

export const initialState: State = {
  songs: null,
  fetching: false
};

export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.MEDIA_REQUEST:
      return {
        songs: null,
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
