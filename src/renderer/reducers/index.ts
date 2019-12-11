import { combineReducers } from "redux";
import * as MediaReducer from "../Page/Songs/Reducer";
export interface State {
  Media: MediaReducer.State;
}
export const initialState: State = {
  Media: MediaReducer.initialState
};

export const reducer = combineReducers<State>({
  Media: MediaReducer.reducer
} as any);
