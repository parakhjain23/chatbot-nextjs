import { call, put } from "redux-saga/effects";
import { getInterfaceByIdApi } from "../../api/InterfaceApis/InterfaceApis.ts";
import { errorToast } from "../../components/customToast";
import actionType from "../../types/utility.ts";
import {
  getInterfaceDataByIdError,
  getInterfaceDataByIdSuccess,
} from "./interfaceSlice.ts";

export function* getInterfaceByIdSaga(
  action: actionType<{ gridId: string; componentId: string }>
): any {
  try {
    const { interfaceId } = action.urlData;
    const response: { [key: string]: any }[] = yield call(
      getInterfaceByIdApi,
      interfaceId
    );
    yield put(getInterfaceDataByIdSuccess(response));
  } catch (error) {
    errorToast("Error Occured while fetching interface try again latter");
    yield put(getInterfaceDataByIdError({}));
  }
}
