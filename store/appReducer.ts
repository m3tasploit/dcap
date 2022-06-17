export const SET_COLOR_SCHEME = "APP/SET_COLOR_SCHEME";
export const SET_IS_LOCATION_GRANTED = "APP/SET_IS_LOCATION_GRANTED";
export const SET_IS_INITIALISED = "APP/SET_IS_INITIALISED";
export const SET_IS_FOUND_PEERS = "APP/SET_IS_FOUND_PEERS";
export const SET_PEERS = "APP/SET_PEERS";
export const SET_ADD_PEERS = "APP/SET_ADD_PEERS";
export const SET_IS_SEARCH_PEERS_DONE = "APP/SET_IS_SEARCH_PEERS_DONE";

export const initialState = {
  colorScheme: "",
  isServer: false,
  isRelay: false,
  isClient: false,
  isInitialised: false,
  isLocationGranted: false,
  isFoundPeers: false,
  peers: [],
  isSearchPeersDone: false,
};

export type AppState = typeof initialState;

export const appReducer = (
  state = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload,
      };
    case SET_IS_LOCATION_GRANTED:
      return {
        ...state,
        isLocationGranted: action.payload,
      };
    case SET_IS_INITIALISED:
      return {
        ...state,
        isInitialised: action.payload,
      };
    case SET_IS_FOUND_PEERS:
      return {
        ...state,
        isFoundPeers: action.payload,
      };
    case SET_PEERS:
      return {
        ...state,
        peers: action.payload,
      };
    case SET_ADD_PEERS:
      return {
        ...state,
        peers: [...state.peers, action.payload],
      };
    case SET_IS_SEARCH_PEERS_DONE:
      return {
        ...state,
        isSearchPeersDone: action.payload,
      };
  }
};
