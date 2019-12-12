import { combineReducers } from "redux";
export interface State {}
export const initialState: State = {};

export const reducer = combineReducers<State>({} as any);
