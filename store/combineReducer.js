import { combineReducers } from "redux";
import InterfaceReducer from "./interface/interfaceSlice.ts";
import helloReducer from "./hello/helloSlice.ts";

const rootReducer = combineReducers({
  Interface: InterfaceReducer,
  Hello: helloReducer,
});

export default rootReducer;
