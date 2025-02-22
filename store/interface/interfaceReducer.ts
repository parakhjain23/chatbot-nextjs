/* eslint-disable */
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";
// import { successToast } from '../../components/customToast'
import {
  $InterfaceReduxType,
  InterFaceDataType,
} from "../../types/interface/InterfaceReduxType.ts";
import actionType from "../../types/utility.ts";

const sampleInterfaceData: any = {
  interfaceContext: {},
  isLoading: false,
  _id: "",
  title: "",
  org_id: "",
  project_id: "",
  created_by: "",
  updated_by: "",
  components: { root: {} },
  coordinates: { root: {} },
  config: {},
  actions: { root: {} },
  frontendActions: { root: {} },
  createdAt: "",
  updatedAt: "",
  threadId: "",
  bridgeName: "root",
};

export const initialState: $InterfaceReduxType = {
  isLoading: false,
  interfaceData: {},
  interfaceContext: {},
  currentSelectedComponent: {},
};

export const reducers: ValidateSliceCaseReducers<
  $InterfaceReduxType,
  SliceCaseReducers<$InterfaceReduxType>
> = {
  getInterfaceDataByIdStart(state, action: actionType<string>) {
    const { interfaceId } = action?.urlData;
    if (!state.interfaceData?.[interfaceId]) {
      state.interfaceData = {
        [interfaceId]: { ...sampleInterfaceData, isLoading: true },
      };
    } else {
      state.interfaceData[interfaceId].isLoading = true;
    }
  },
  getInterfaceDataByIdSuccess(state, action: actionType<InterFaceDataType>) {
    const { interfaceId } = action?.urlData;
    const tempData = { ...action.payload };
    state.interfaceData[interfaceId] = { ...tempData, isLoading: false };
  },
  getInterfaceDataByIdError(state, action: actionType<any>) {
    const { interfaceId } = action?.urlData;
    state.interfaceData[interfaceId].isLoading = false;
  },

  updateComponentProps(state, action: actionType<any>) {
    const { interfaceId } = action.urlData;
    const { data, gridId, componentId } = action.payload;
    state.interfaceData[interfaceId].components[gridId][componentId].props = {
      ...state.interfaceData[interfaceId].components[gridId][componentId].props,
      ...data,
    };
  },

  toggleNestedGridSliderOpen(state, action) {
    state.nestedGridSliderOpen = action.payload || false;
  },

  setConfigModalState(state, action) {
    state.currentSelectedComponent = {
      ...state.currentSelectedComponent,
      ...action.payload,
    };
  },

  resetConfigModalState(state) {
    state.currentSelectedComponent = {
      componentType: null,
      componentId: null,
      gridId: null,
    };
  },

  setConfigSlider(state, action) {
    state.isConfigSliderOpen = action?.payload?.openSlider || false;
  },

  addInterfaceContext(
    state,
    action: actionType<{
      gridId: string;
      msgId: string;
      componentId: string;
      value: string;
    }>
  ) {
    const { interfaceId } = action.urlData;
    const { msgId = "", gridId } = action.payload;
    const newGridId = msgId?.length > 0 ? `${gridId}_${msgId}` : gridId;

    state.interfaceContext[interfaceId] = {
      ...state.interfaceContext[interfaceId],
      context: {
        ...state.interfaceContext[interfaceId]?.context,
        [newGridId]: {
          ...state.interfaceContext[interfaceId]?.context?.[newGridId],
          [action.payload.componentId]: action.payload.value || "",
        },
      },
    };
  },

  addDefaultContext(state, action: actionType<any>) {
    const { interfaceId } = action.urlData;
    const bridgeName = action.payload?.bridgeName || state.bridgeName || "root";
    const variables = action.payload?.variables;

    // Ensure the interfaceId level is initialized if not already
    if (!state.interfaceContext[interfaceId]) {
      state.interfaceContext[interfaceId] = {};
    }

    // Ensure the bridgeName level is initialized under the current interfaceId if not already
    if (!state.interfaceContext[interfaceId][bridgeName]) {
      state.interfaceContext[interfaceId][bridgeName] = {
        interfaceData: {},
        threadList: {},
      };
    }

    // Update the state with new data under the specific interfaceId and bridgeName
    state.interfaceContext[interfaceId][bridgeName] = {
      ...state.interfaceContext[interfaceId][bridgeName],
      interfaceData: {
        ...state.interfaceContext[interfaceId][bridgeName].interfaceData,
        ...variables,
      },
    };
  },

  setThreads(state, action) {
    const { interfaceId } = action?.urlData || {};
    const bridgeName = action.payload?.bridgeName || state.bridgeName || "root";
    const threadId = action.payload?.threadId || state.threadId;
    const threadData = action.payload?.newThreadData || {};
    const allThreadList = action.payload?.threadList || [];

    // Create a local copy of the interfaceContext
    const updatedInterfaceContext = { ...state.interfaceContext };

    // Ensure the interfaceId level is initialized if not already
    if (!updatedInterfaceContext[interfaceId]) {
      updatedInterfaceContext[interfaceId] = {};
    }

    // Ensure the bridgeName level is initialized under the current interfaceId if not already
    if (!updatedInterfaceContext[interfaceId][bridgeName]) {
      updatedInterfaceContext[interfaceId][bridgeName] = {
        interfaceData: {},
        threadList: {},
      };
    }

    if (!updatedInterfaceContext[interfaceId][bridgeName].threadList) {
      updatedInterfaceContext[interfaceId][bridgeName].threadList = {}; // Initialize threadList if it doesn't exist
    }
    // Ensure threadList exists for the given threadId
    if (
      !updatedInterfaceContext[interfaceId][bridgeName]?.threadList?.[threadId]
    ) {
      updatedInterfaceContext[interfaceId][bridgeName].threadList[threadId] =
        [];
    }

    // If threadList is provided, replace the existing threadList
    if (!(Object.keys(threadData || {}).length > 0)) {
      // Replace thread list with the new list
      updatedInterfaceContext[interfaceId][bridgeName].threadList[threadId] =
        allThreadList;
      if (state.threadId) {
        const selectedThread = allThreadList.find(
          (thread: any) => thread.thread_id === state.threadId
        );
        if (
          !state?.subThreadId &&
          state.threadId === selectedThread?.thread_id
        ) {
          state.subThreadId =
            allThreadList[allThreadList.length - 1]?.sub_thread_id;
        } else if (selectedThread === undefined) {
          state.subThreadId = state.threadId;
        }
      }
      if (allThreadList?.length === 0) {
        updatedInterfaceContext[interfaceId][bridgeName].threadList[
          threadId
        ].push({
          thread_id: threadId,
          sub_thread_id: threadId,
          display_name: threadId,
        });
        state.subThreadId = threadId;
      }
    } else {
      // Otherwise, push the new threadData to the thread list
      updatedInterfaceContext[interfaceId][bridgeName].threadList[
        threadId
      ].push(threadData);
      state.subThreadId = threadData?.sub_thread_id || ""; // Store in reducer state
    }

    state.interfaceContext = updatedInterfaceContext;
  },

  setThreadId(state, action: actionType<any>) {
    const data = action.payload;
    if (data?.threadId && data.threadId !== state?.threadId) {
      state.subThreadId = "";
    }
    if (data.subThreadId) {
      state.subThreadId = data?.subThreadId || "";
    }
    Object.keys(data || {}).forEach((element) => {
      state[element] = data[element];
      sessionStorage.setItem(element, data[element]);
    });
  },
  get(state, action: actionType<any>) {
    const data = action.payload;
    const tempData = {};
    Object.keys(data || {})?.forEach((element) => {
      tempData[element] = data[element];
      sessionStorage.setItem(element, data[element]);
    });
    return { ...state, ...tempData };
  },
  setConfig(state, action: actionType<any>) {
    const data = action.payload.vision;
    if (!state.isVision) {
      state.isVision = {};
    }
    state.isVision = data;
    sessionStorage.setItem("config", JSON.stringify(state.isVision));
  },
};
