import Todo from "../models/todo.model.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";

//#region delete todo

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  await Todo.findByIdAndDelete(todoId);

  res.status(200).json(new ApiResponse(200, {}, "Todo deleted succesfully !!"));
});

//#endregion

//#region completed todo

export const completeTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new ApiError(400, "ERROR :: Can't able to update todo state !");
  }

  await Todo.findByIdAndUpdate(
    todoId,
    { $set: { completed: !todo.completed } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, {}, "Todo update succesfully !!"));
});

//#endregion
