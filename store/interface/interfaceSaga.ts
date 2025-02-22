import { takeLatest } from "redux-saga/effects";
import { getInterfaceByIdSaga } from "./interefaceGeneratorFunctions.ts";

export default function* InterfaceSaga() {
  // yield takeLatest("Interface/getAllInterfaceStart", getAllInterfaceSaga);
  // yield takeLatest("Interface/createInterfaceStart", createInterfaceSaga);
  // yield takeLatest("Interface/updateInterfaceStart", updateInterfaceSaga);
  // yield takeLatest(
  //   "Interface/updateInterfaceDetailsStart",
  //   updateInterfaceDetailsSaga
  // );
  // yield takeLatest("Interface/deleteInterfaceStart", deleteInterfaceSaga);
  // yield takeLatest(
  //   "Interface/updateInterfaceActionStart",
  //   updateInterfaceActionSaga
  // );
  // yield takeLatest(
  //   "Interface/updateInterfaceFrontendActionStart",
  //   updateInterFrontendfaceActionSaga
  // );
  yield takeLatest("Interface/getInterfaceDataByIdStart", getInterfaceByIdSaga);
  // yield takeLatest("Interface/deleteComponentStart", deleteComponentSaga);
}
