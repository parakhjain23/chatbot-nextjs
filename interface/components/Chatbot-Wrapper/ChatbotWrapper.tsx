"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc";
import {
  addDefaultContext,
  getInterfaceDataByIdStart,
  setConfig,
  setThreadId,
} from "../../../store/interface/interfaceSlice";
import { GetSessionStorageData } from "../../utils/InterfaceUtils";
import InterfaceChatbot from "../Interface-Chatbot/InterfaceChatbot";

function ChatbotWrapper({ interfaceId, loadInterface = true }) {
  const dispatch = useDispatch();

  useEffect(() => {
    window?.parent?.postMessage({ type: "interfaceLoaded" }, "*");
  }, []);

  useEffect(() => {
    (async () => {
      // const interfaceToken = intefaceGetLocalStorage("interfaceToken");
      const interfaceToken = GetSessionStorageData("interfaceToken");
      if (
        interfaceId &&
        interfaceId !== "preview" &&
        interfaceToken &&
        loadInterface
      ) {
        dispatch(getInterfaceDataByIdStart({}));
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === "interfaceData") {
        const receivedData = event?.data?.data;
        console.log(receivedData, "receivedData on chatbot");
        if (receivedData) {
          const {
            threadId = null,
            bridgeName = null,
            vision = null,
            helloId = null,
            version_id = null,
          } = receivedData;
          if (threadId) {
            dispatch(setThreadId({ threadId: threadId }));
          }
          if (helloId) {
            dispatch(setThreadId({ helloId: helloId }));
          }
          if (version_id) {
            dispatch(setThreadId({ version_id: version_id }));
          }
          if (bridgeName) {
            dispatch(setThreadId({ bridgeName: bridgeName || "root" }));
            dispatch(
              addDefaultContext({
                variables: { ...receivedData?.variables },
                bridgeName: bridgeName,
              })
            );
          }
          if (vision) {
            dispatch(setConfig({ vision: vision }));
          } else {
            dispatch(
              addDefaultContext({ variables: { ...receivedData?.variables } })
            );
          }
        }
      }
    };

    if (loadInterface) {
      window.addEventListener("message", handleMessage);
    }
    return () => {
      if (loadInterface) {
        window.removeEventListener("message", handleMessage);
      }
    };
  }, [dispatch, interfaceId, loadInterface]);

  return <InterfaceChatbot />;
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotWrapper), [ParamsEnums.interfaceId])
);
