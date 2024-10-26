import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  backlogTask: 0,
  todoTask: 0,
  inProgressTask: 0,
  completedTask: 0,
  dueDateTask: 0,
  lowPriority: 0,
  modPriority: 0,
  highPriority: 0,
  backlogTasks: [
    {
      todos: [
        {
          _id: "67193875a58aba8e7f46e2ea",
          text: "Do Javascript",
          completed: false,
          __v: 0,
        },
        {
          _id: "67193875a58aba8e7f46e2ec",
          text: "Do C++",
          completed: true,
          __v: 0,
        },
        {
          _id: "67193875a58aba8e7f46e2ee",
          text: "Do Python",
          completed: false,
          __v: 0,
        },
      ],
      title: "Hero title",
      priority: "high",
      dueDate: "2024-10-25T18:30:00.000Z",
      state: "progress",
    },
  ],
  todoTasks: [],
  inProgressTasks: [],
  completedTasks: [],
};

const taskReducer = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasks: (state, action) => {
      const { tasks } = action.payload;

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
    },
    
  },
});

export const { fetchTasks } = taskReducer.actions;

export default taskReducer.reducer;
