import { createSlice } from "@reduxjs/toolkit";

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
