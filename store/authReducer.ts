import { createSlice } from "@reduxjs/toolkit";

export const LOGIN = "APP/AUTH/LOGIN";

export interface AuthState {
  login: [];
}

export const initialState: AuthState = {
  login: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export default authSlice.reducer;
