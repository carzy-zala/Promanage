import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import ApiError from "./util/ApiError.js";

const app = express();

app.use(
  cors()
  //     {
  //     origin: process.env.CORS_ORIGIN,
  //     credentials: true,
  //   }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Router
import userRoutes from "./router/user.router.js";
import taskRoutes from "./router/task.router.js";
import todoRoutes from "./router/todo.router.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/todo", todoRoutes);

//#region For Error

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
});

//#endregion

export default app;
