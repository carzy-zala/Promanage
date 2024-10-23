import { Router } from "express";
import {
  addTask,
  allTasksOfMonth,
  allTasksOfWeek,
  deleteTask,
  editTask,
  task,
} from "../controllers/task.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";

const taskRoutes = Router();

taskRoutes.route("/create").post(verifyJWT, addTask);
taskRoutes.route("/").get(verifyJWT, allTasksOfWeek);
taskRoutes.route("/month").get(verifyJWT, allTasksOfMonth);
taskRoutes.route("/:taskId").get(task);
taskRoutes.route("/edit").patch(verifyJWT, editTask);
taskRoutes.route("/delete/:taskId").delete(verifyJWT, deleteTask);

export default taskRoutes;
