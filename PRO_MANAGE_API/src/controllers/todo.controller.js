import Todo from "../models/todo.model.js";
import ApiResponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";

//#region delete todo

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  await Todo.findByIdAndDelete(todoId);

  res.status(200).json(new ApiResponse(200, {}, "Todo deleted succesfully !!"));
});

//#endregion
