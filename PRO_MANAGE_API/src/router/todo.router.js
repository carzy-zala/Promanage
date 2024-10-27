import { Router } from "express";
import { completeTodo, deleteTodo } from "../controllers/todo.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const todoRoutes = Router();

todoRoutes.route("/delete/:todoId").delete(verifyJWT, deleteTodo);
todoRoutes.route("/completed/:todoId").get(verifyJWT, completeTodo);

export default todoRoutes;
