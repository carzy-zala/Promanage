import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import Todo from "../models/todo.model.js";
import Task from "../models/task.model.js";

//#region get week

function getCurrentDateRange(days) {
  const currentDate = new Date();

  const startOfLastWeek = new Date(currentDate);
  startOfLastWeek.setDate(currentDate.getDate() - days - 1);
  startOfLastWeek.setHours(0, 0, 0, 0);

  return { startOfLastWeek, currentDate };
}

//#endregion

//#region add task

export const addTask = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { title, priority, assignTo, dueDate, todos } = req.body;

  if ([title, priority].some((field) => field.trim() === "")) {
    throw new ApiError(
      400,
      "ERROR :: Title,Priority and Due Date are compulsory !!"
    );
  }

  const newTask = await Task.create({ title, priority, dueDate, owner });

  if (!newTask) {
    throw new ApiError(500, "ERROR :: Error occurred while creaating task !");
  }

  if (todos.length === 0) {
    throw new ApiError(
      500,
      "ERROR :: Please enter at least one todos in task !!"
    );
  }

  for (let todo of todos) {
    try {
      const { text, completed } = todo;

      await Todo.create({
        text,
        completed,
        taskId: newTask._id,
      });
    } catch (error) {
      throw new ApiError(500, "ERROR :: Error occurred while creating todos !");
    }
  }

  const newTodos = await Todo.find({ taskId: newTask._id }).select("-taskId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { task: { todos: newTodos, ...newTask._doc } },
        "Task created successfully !"
      )
    );
});

//#endregion

//#region getting task

export const allTasksOfWeek = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const { startOfLastWeek, currentDate } = getCurrentDateRange(7);

  const tasks = await Task.find({
    owner,
    createdAt: {
      $gte: startOfLastWeek,
      $lte: currentDate,
    },
  }).select("-owner");

  if (!tasks) {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Tasks fetched succesfully !"));
  }

  let userTasks = [];

  for (let task of tasks) {
    try {
      const todos = await Todo.find({ taskId: task._id }).select("-taskId");
      userTasks.push({ ...task._doc, todos });
    } catch (error) {
      throw new ApiError(
        400,
        "ERROR :: Error occurred while fetching all todos !"
      );
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, { userTasks }, "Task fetched successfully !"));
});

export const allTasksOfMonth = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const { startOfLastWeek, currentDate } = getCurrentDateRange(30);

  const tasks = await Task.find({
    owner,
    createdAt: {
      $gte: startOfLastWeek,
      $lte: currentDate,
    },
  }).select("-owner");

  if (!tasks) {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Tasks fetched succesfully !"));
  }

  let userTasks = [];

  for (let task of tasks) {
    try {
      const todos = await Todo.find({ taskId: task._id }).select("-taskId");
      userTasks.push({ ...task._doc, todos });
    } catch (error) {
      throw new ApiError(
        400,
        "ERROR :: Error occurred while fetching all todos !"
      );
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, { userTasks }, "Tasks fetched successfully !"));
});

export const allTasksOfDay = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const { startOfLastWeek, currentDate } = getCurrentDateRange(1);

  const tasks = await Task.find({
    owner,
    createdAt: {
      $gte: startOfLastWeek,
      $lte: currentDate,
    },
  }).select("-owner");

  if (!tasks) {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Todays Tasks fetched succesfully !"));
  }

  let userTasks = [];

  for (let task of tasks) {
    try {
      const todos = await Todo.find({ taskId: task._id }).select("-taskId");
      userTasks.push({ ...task._doc, todos });
    } catch (error) {
      throw new ApiError(
        400,
        "ERROR :: Error occurred while fetching all todos !"
      );
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, { userTasks }, "Tasks fetched successfully !"));
});

export const task = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const userTask = await Task.findById(taskId);

  if (!userTask) {
    throw new ApiError(400, "ERROR :: Your task doesn't existed more !");
  }

  const todos = await Todo.find({ taskId }).select("-taskId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { task: { ...userTask._doc, todos } },
        "Task fetched successfully !"
      )
    );
});

//#endregion

//#region  delete task

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  await Task.findByIdAndDelete(taskId);
  await Todo.deleteMany({ taskId });

  res.status(200).json(new ApiResponse(200, {}, "Task delete successfully !"));
});

//#endregion

//#region  edit task

export const editTask = asyncHandler(async (req, res) => {
  const { _id, title, priority, assignedTo, dueDate, todos } = req.body;

  const existedTask = await Task.findById(_id);

  if (!existedTask) {
    throw new ApiError(400, "ERROR :: Error while editing task !!");
  }

  existedTask.title = title;
  existedTask.priority = priority;
  existedTask.dueDate = dueDate;
  existedTask.assignedTo = assignedTo;

  existedTask.save();

  for (let todo of todos) {
    try {
      const { text, completed } = todo;

      if (!todo._id) {
        await Todo.create({ text, completed, taskId: _id });
      } else {
        const existedTodo = await Todo.findById(todo._id).select("-taskId");
        existedTodo.text = text;
        existedTodo.completed = completed;

        existedTodo.save();
      }
    } catch (error) {
      throw new ApiError(400, "ERROR :: Error while editing todo !!");
    }
  }

  const task = await Task.findById(_id);

  const updatedTodo = await Todo.find({ taskId: task._id }).select("-taskId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...task._doc, todos: [...updatedTodo] },
        "Task edited successfully !"
      )
    );
});

//#endregion

//#region edit state

export const editState = asyncHandler(async (req, res) => {
  const { taskId, newState } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(500, "ERROR :: Sorry ! Task status can't be change !");
  }

  await Task.findByIdAndUpdate(
    taskId,
    { $set: { state: newState } },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Task status updated succesfully !"));
});

//#endregion
