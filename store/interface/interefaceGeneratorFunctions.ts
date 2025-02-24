import { call, put } from "redux-saga/effects";
import { getInterfaceByIdApi } from "@/config/api";
import { errorToast } from "@/components/customToast";
import { actionType } from "@/types/utility";
import {
  getInterfaceDataByIdError,
  getInterfaceDataByIdSuccess,
} from "./interfaceSlice";

export function* getInterfaceByIdSaga(
  action: actionType<{ gridId: string; componentId: string }>
): any {
  try {
    const { chatbotId } = action.urlData;
    const response: { [key: string]: any }[] = yield call(
      getInterfaceByIdApi,
      chatbotId
    );
    yield put(getInterfaceDataByIdSuccess(response));
  } catch (error) {
    errorToast("Error Occured while fetching interface try again latter");
    yield put(getInterfaceDataByIdError({}));
  }
}
