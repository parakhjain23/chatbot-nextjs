import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import createSagaMiddleware from "redux-saga";
import helloReducer from "./hello/helloSlice.ts";
import InterfaceReducer from "./interface/interfaceSlice.ts";
import rootSaga from "./rootSaga.ts";

export const getInfoParamtersFromUrl = () => {
  const params = window.location.pathname.slice(1)?.split("/");
  const urlParameters = {};
  if (params[0] === "i") urlParameters.interfaceId = params[1];
  return urlParameters;
};


const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const customMiddleware = () => (next) => (action) => {
  action.urlData = getInfoParamtersFromUrl();
  return next(action);
};

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: ["appInfo"]
};

const rootReducer = combineReducers({
  // Import your reducers here
  Interface: InterfaceReducer,
  Hello: helloReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }).concat(customMiddleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
