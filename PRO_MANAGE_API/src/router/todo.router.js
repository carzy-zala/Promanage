import { Router } from "express";
import { deleteTodo } from "../controllers/todo.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const todoRoutes = Router();

todoRoutes.route("/delete/:todoId").delete(verifyJWT, deleteTodo);

export default todoRoutes;
