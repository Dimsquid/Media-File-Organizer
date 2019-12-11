import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { reducer } from "../reducers";

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */

const store = createStore(reducer, applyMiddleware(thunkMiddleware, logger)); //Add ",logger" after thunkMiddleware when debugging redux store

export default store;
