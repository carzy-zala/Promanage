import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Feature/userSlice.js";
import taskReducer from "../Feature/taskSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
  },
});

export default store;
