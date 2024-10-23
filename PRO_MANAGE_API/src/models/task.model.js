import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    priority: {
      type: String,
      enum: ["high", "low", "mod"],
      require: true,
    },
    assignTo: [String],
    dueDate: {
      type: Date,
      require: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    state: {
      type: String,
      enum: ["todo","backlog","progress","done"],
      default : "todo"
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;
