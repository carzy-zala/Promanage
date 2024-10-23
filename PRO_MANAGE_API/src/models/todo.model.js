import { Schema, model } from "mongoose";

const todoSchema = new Schema({
  text: {
    type: String,
    require: true,
  },
  completed: {
    type: Boolean,
    default: false,
    require: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    require: true,
  },
});

const Todo = model("Todo", todoSchema);

export default Todo;
