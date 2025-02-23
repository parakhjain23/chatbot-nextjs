import { takeLatest } from "redux-saga/effects";
import { getHelloDetailsSaga } from "./helloGeneratorFunctions";

export default function* InterfaceSaga() {
  yield takeLatest("Hello/getHelloDetailsStart", getHelloDetailsSaga);
}
