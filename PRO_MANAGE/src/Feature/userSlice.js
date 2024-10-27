import { createSlice } from "@reduxjs/toolkit";
import setToken from "../utils/setToken";

const initialState = {
  isAuthenticated: false,
  name: "",
  email: "",
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialized: (state) => {
      if (localStorage.getItem("accessToken")) {
        state.isAuthenticated = true;
        setToken(localStorage.getItem("accessToken"));
      }
    },
    registerUserAction: (state, action) => {
      state.email = action.payload.email;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      const { name, email } = action.payload;
      state.name = name;
      state.email = email;
    },
    reset: (state) => {
      state = { ...initialState };
    },
  },
});

export const { initialized, registerUserAction, login, reset } =
  userReducer.actions;

export default userReducer.reducer;
