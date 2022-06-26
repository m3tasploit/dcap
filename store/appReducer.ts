import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PeerType, WifiP2pDeviceType } from "../hooks/usePeer";

export const SET_COLOR_SCHEME = "APP/SET_COLOR_SCHEME";
export const SET_IS_LOCATION_GRANTED = "APP/SET_IS_LOCATION_GRANTED";
export const SET_IS_INITIALISED = "APP/SET_IS_INITIALISED";
export const SET_IS_FOUND_PEERS = "APP/SET_IS_FOUND_PEERS";
export const SET_PEERS = "APP/SET_PEERS";
export const SET_ADD_PEERS = "APP/SET_ADD_PEERS";
export const SET_IS_SEARCH_PEERS_DONE = "APP/SET_IS_SEARCH_PEERS_DONE";
export const SET_CONNECT_SCREEN_MESSAGE = "APP/SET_CONNECT_SCREEN_MESSAGE";
export const SET_CREATING_SERVER = "APP/SET_CREATING_SERVER";
export const SET_IS_SERVER = "APP/SET_IS_SERVER";

export interface AppState {
  colorScheme: string;
  isServer: boolean;
  isRelay: boolean;
  isClient: boolean;
  isInitialised: boolean;
  isLocationGranted: boolean;
  isFoundPeers: boolean;
  peers: Array<WifiP2pDeviceType>;
  isSearchPeersDone: boolean;
  connectScreenMessage: string;
  creatingServer: boolean;
}

export const initialState: AppState = {
  colorScheme: "",
  isServer: false,
  isRelay: false,
  isClient: false,
  isInitialised: false,
  isLocationGranted: false,
  isFoundPeers: false,
  peers: [],
  isSearchPeersDone: false,
  connectScreenMessage: "",
  creatingServer: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setColorScheme(state, action: PayloadAction<string>) {
      state.colorScheme = action.payload;
    },
    setPeers(state, action: PayloadAction<Array<WifiP2pDeviceType>>) {
      state.peers = action.payload;
    },
  },
});

export const { setColorScheme, setPeers } = appSlice.actions;

export default appSlice.reducer;
