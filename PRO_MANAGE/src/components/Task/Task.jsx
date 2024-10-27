import React, { useEffect, useRef, useState } from "react";
import "./Task.css";
import Input from "../Input";
import Button from "../Button";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { axiosDelete, axiosPatch, axiosPost } from "../../service/AxiosConfig";
import { apiRoutes } from "../../service/ApiRoutes.js";
import Loader from "../Loader/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../Feature/taskSlice.js";
import { useNavigate } from "react-router-dom";

function Task({
  handleCreatePortal,
  isEditTask = false,
  editTask = {
    title: "",
    priority: "",
    dueDate: "",
    todos: [],
  },
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({ defaultValues: editTask });

  const selectedTime = useSelector(store=>store.tasks.selectedTime)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "todos",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteTodo, setIsDeleteTodo] = useState(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const task = async (data) => {
    if (!isLoading) {
      setIsLoading(true);

      let response;
      if (isEditTask) {
        response = await axiosPatch(
          `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.EDIT_TASK}`,
          data
        );
      } else {
        response = await axiosPost(
          `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_CREATE}`,
          data
        );
      }

      if (response.success) {
        dispatch(fetchTasks(selectedTime)); 
        toast.success(response.message);
        handleCreatePortal(false);
      } else {
        toast.error(response.message);
      }


      setIsLoading(false);
    }
  };

  const [completedTask, setCompletedTask] = useState(
    fields.filter((field) => field.completed === true).length || 0
  );

  const taskError = (errors) => {
    switch (Object.keys(errors)[0]) {
      case "title":
        toast.error(errors["title"].message);
        break;
      case "priority":
        toast.error(errors["priority"].message);
        break;
    }
  };

  const handleDeleteTodo = async (index) => {
    if (isEditTask && !isDeleteTodo) {
      setIsDeleteTodo(true);

      const response = await axiosDelete(
        `${import.meta.env.VITE_BACKEND_API_URL}${
          apiRoutes.DELETE_TODO
        }`.replace(":todoId", editTask.todos[index]._id)
      );

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }

      setIsDeleteTodo(false);
    }

    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(task, taskError)}>
      <div className="task-main-div">
        <div className="title-heading">
          Title
          <span style={{ color: "#FF0000" }}>*</span>
        </div>
        <div>
          <Input
            placeholder="Enter Task Title"
            id="title"
            {...register("title", { required: "Title can't be empty !" })}
          />
        </div>

        <div className="priority">
          <div className="priority-heading">
            Select Priority
            <span style={{ color: "#FF0000" }}>*</span>
          </div>
          <div
            className={`priority-radio-btn-div ${
              watch("priority") === "high" ? "selected-priority-high" : ""
            }`}
          >
            <Input
              type="radio"
              id="high"
              value="high"
              className="priority-radio-btn"
              {...register("priority", {
                required: "Priority must be selected !",
              })}
            />
            <div className="priority-details">
              <div
                className="add-circle"
                style={{ backgroundColor: "#FF2473" }}
              ></div>
              HIGH PRIORITY
            </div>
          </div>

          <div
            className={`priority-radio-btn-div ${
              watch("priority") === "mod" ? "selected-priority-mod" : ""
            }`}
          >
            <Input
              type="radio"
              id="mod"
              value="mod"
              className="priority-radio-btn"
              {...register("priority", {
                required: "Priority must be selected !",
              })}
            />
            <div className="priority-details">
              <div
                className="add-circle"
                style={{ backgroundColor: "#18B0FF" }}
              ></div>
              MODERATE PRIORITY
            </div>
          </div>

          <div
            className={`priority-radio-btn-div ${
              watch("priority") === "low" ? "selected-priority-low" : ""
            }`}
          >
            <Input
              type="radio"
              id="low"
              value="low"
              className="priority-radio-btn"
              {...register("priority", {
                required: "Priority must be selected !",
              })}
            />
            <div className="priority-details">
              <div
                className="add-circle"
                style={{ backgroundColor: "#63C05B" }}
              ></div>
              LOW PRIORITY
            </div>
          </div>
        </div>

        <div className="checklist">
          <div className="checklist-heading">
            Checklist ({completedTask}/{fields.length})
            <span style={{ color: "#FF0000" }}>*</span>
          </div>

          <div className="task-todos">
            {fields.map((field, index) => (
              <div className="task-todo" key={`todos.${index}`}>
                <Input
                  onClick={() => {
                    !watch(`todos[${index}]completed`)
                      ? setCompletedTask((prev) => prev + 1)
                      : setCompletedTask((prev) => prev - 1);
                  }}
                  {...register(`todos.${index}.completed`)}
                  type="checkbox"
                  defaultChecked={field.completed}
                />
                <Input
                  {...register(`todos.${index}.text`)}
                  placeholder="Add a task"
                  defaultvalues={field.text || ""}
                />
                <div>
                  <Button
                    className="delete-todo-btn"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    <img src="/delete.svg" height="25px" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              className="todo-add-new"
              children="+ Add New"
              onClick={() => {
                append({ text: "", completed: false });
              }}
            />
          </div>
        </div>

        <div className="task-footer">
          <div style={{ position: "relative" }}>
            <Input
              type="date"
              id="dueDate"
              className="date-input"
              min={new Date().toISOString().split("T")[0]}
              {...register("dueDate")}
            />
            <Button children="Select Due Date" className="date-btn" />
          </div>
          <div className="task-footer-right-btns">
            <Button
              className="task-update-cancel-btn"
              children="Cancel"
              onClick={() => handleCreatePortal(false)}
            />
            <Button
              className="task-update-save-btn"
              children={isLoading ? <Loader backgroundColor="white" /> : "Save"}
              type="submit"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default Task;
