import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { getHelloDetailsApi } from "../../api/InterfaceApis/InterfaceApis.ts";
import { errorToast } from "../../components/customToast";
import { getHelloDetailsSuccess } from "./helloSlice.ts";

export function* getHelloDetailsSaga(
  action: PayloadAction<{
    threadId: string;
    slugName: string;
    helloId?: string | null;
    versionId: string | null;
  }>
): SagaIterator {
  try {
    const {
      threadId,
      slugName,
      helloId = null,
      versionId = null,
    } = action.payload;
    const response: { [key: string]: any } = yield call(getHelloDetailsApi, {
      slugName,
      threadId,
      helloId,
      versionId,
    });
    const receivedHelloId = response?.widgetInfo?.helloId;
    const anonymousClientId = response?.ChannelList?.uuid;
    if (receivedHelloId && anonymousClientId) {
      localStorage.setItem(
        "HelloAgentAuth",
        `${receivedHelloId}:${anonymousClientId}`
      );
    }
    yield put(getHelloDetailsSuccess(response));
  } catch (error) {
    errorToast(
      "Error occurred while fetching hello details, please try again later."
    );
  }
}
