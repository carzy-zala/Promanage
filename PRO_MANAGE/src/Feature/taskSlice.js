import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRoutes } from "../service/ApiRoutes.js";
import { axiosGet } from "../service/AxiosConfig.js";

export const fetchTasks = createAsyncThunk("task/fetchTasks", (day = 7) => {
  if (day === 30) {
    return axiosGet(
      `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_MONTH}`
    ).then((response) => {
      return {userTasks : response.data.userTasks , selectedTime:30};
    });
  }

  if (day === 1) {
    return axiosGet(
      `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_DAY}`
    ).then((response) => {      
      return {userTasks : response.data.userTasks , selectedTime:1};
    });
  }

  return axiosGet(
    `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_WEEK}`
  ).then((response) => {
    
    return {userTasks : response.data.userTasks , selectedTime:7};
  });
});

const initialState = {
  backlogTask: 0,
  todoTask: 0,
  inProgressTask: 0,
  completedTask: 0,
  dueDateTask: 0,
  lowPriority: 0,
  modPriority: 0,
  highPriority: 0,
  backlogTasks: [],
  todoTasks: [],
  inProgressTasks: [],
  completedTasks: [],
  selectedTime : 7
};

const taskReducer = createSlice({
  name: "tasks",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {});
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      const { userTasks: tasks ,selectedTime} = action.payload;

      state.selectedTime = selectedTime;

      state.backlogTasks = tasks.filter((task) => task.state === "backlog");
      state.inProgressTasks = tasks.filter((task) => task.state === "progress");
      state.todoTasks = tasks.filter((task) => task.state === "todo");
      state.completedTasks = tasks.filter((task) => task.state === "done");

      state.backlogTask = tasks.filter(
        (task) => task.state === "backlog"
      ).length;
      state.inProgressTask = tasks.filter(
        (task) => task.state === "progress"
      ).length;
      state.todoTask = tasks.filter((task) => task.state === "todo").length;
      state.completedTask = tasks.filter(
        (task) => task.state === "done"
      ).length;

      state.lowPriority = tasks.filter(
        (task) => task.priority === "low"
      ).length;
      state.highPriority = tasks.filter(
        (task) => task.priority === "high"
      ).length;
      state.modPriority = tasks.filter(
        (task) => task.priority === "mod"
      ).length;
      state.dueDateTask = tasks.filter(
        (task) => task.dueData === new Date()
      ).length;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.error = "Please try again later !";
    });
  },
});

export default taskReducer.reducer;
