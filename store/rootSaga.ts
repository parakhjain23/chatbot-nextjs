import { all, fork } from "redux-saga/effects";
import InterfaceSaga from "./interface/interfaceSaga";
import HelloSaga from "./hello/helloSaga";

export default function* rootSaga() {
  yield all([fork(InterfaceSaga)]);
  yield all([fork(HelloSaga)]);
}
