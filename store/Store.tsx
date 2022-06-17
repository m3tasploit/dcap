import React from "react";

type GlobalState = {
  auth: AuthState;
  app: AppState;
};

export const initialState: GlobalState = {
  auth: authState,
  // chats: [],
  // chat: {},
  // user: {},
  app: appState,
};

import {
  authReducer,
  AuthState,
  initialState as authState,
} from "../store/authReducer";
import {
  appReducer,
  AppState,
  initialState as appState,
} from "../store/appReducer";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const rootReducer = combineReducers({ auth: authReducer, app: appReducer });

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
