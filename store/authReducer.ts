export const LOGIN = "APP/AUTH/LOGIN";

export const initialState = {
  login: [],
};

export type AuthState = typeof initialState;

export const authReducer = (state = initialState, action: { type: string }) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
      };
  }
};
