import React, { useEffect, useRef, useState } from "react";
import "./Task.css";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
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

const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

function Task({
  handleCreatePortal,
  isEditTask = false,
  editTask = {
    title: "",
    priority: "",
    dueDate: "",
    todos: [],
    assignTo: [],
  },
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({ defaultValues: editTask });

  const selectedTime = useSelector((store) => store.tasks.selectedTime);
  const [dueDate, setDueDate] = useState(
    isEditTask ? editTask.dueDate && new Date(editTask.dueDate) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "todos",
  });

  const { fields: emailField, append: assignedAppend } = useFieldArray({
    control,
    name: "assignTo",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteTodo, setIsDeleteTodo] = useState(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const task = async (data) => {

    if (!isLoading) {
      setIsLoading(true);
      const { title, priority, todos, assignTo } = data;


      let response;
      if (isEditTask) {
        response = await axiosPatch(
          `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.EDIT_TASK}`,
          {
            _id: editTask._id,
            title,
            priority,
            todos,
            dueDate: formatDate(dueDate),
            assignTo,
          }
        );
      } else {
        response = await axiosPost(
          `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_CREATE}`,
          { title, priority, todos, dueDate, assignTo }
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

  // Format date to MM/DD/YYYY

  const handleDateChange = (date) => {
    setDueDate(date);
    setShowCalendar(false);
  };

  const handleClearDate = () => {
    setDueDate(null);
    register("dueDate").onChange({ target: { value: null } });
  };

  const handleToday = () => {
    const today = new Date();
    handleDateChange(today);
  };

  // Assign to

  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];

  const handleChange = (e) => {
    const input = e.target.value;
    setEmail(input);

    // If input contains an '@', show domain suggestions
    if (input.includes("@")) {
      const [name, domainPart] = input.split("@");

      if (domainPart.length >= 1) {
        const filteredDomains = domains
          .filter((domain) => domain.startsWith(domainPart))
          .map((domain) => `${name}@${domain}`);
        setSuggestions(filteredDomains);
        setShowSuggestions(true);
      } else {
        const defaultSuggestions = domains.map((domain) => `${name}@${domain}`);
        setSuggestions(defaultSuggestions);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAssign = (suggestion) => {
    if (watch("assignTo").includes(suggestion)) {
      toast.success(`Already assigned !`);
    } else {
      setEmail("");
      assignedAppend(suggestion);
      setShowSuggestions(false);
      toast.success(`Task assigned to ${suggestion} succesfully !`);
    }
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
              watch("priority") === "high" ? "selected-priority" : ""
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
              watch("priority") === "mod" ? "selected-priority" : ""
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
              watch("priority") === "low" ? "selected-priority" : ""
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

        <div className="assignto">
          <div className="assignto-heading">Assign To</div>

          <div style={{ position: "relative", width: "300px" }}>
            <Input
              type="text"
              value={email}
              onChange={handleChange}
              placeholder="Add a assignee"
              style={{
                width: "50rem",
                padding: "0.8rem",
                fontSize: "1.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #ccc",
              }}
            />
            {showSuggestions && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  width: "50rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  listStyleType: "none",
                  padding: "5px 0",
                  margin: 0,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: 1,
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      fontSize: "1.4rem",
                    }}
                  >
                    {suggestion}

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssign(suggestion);
                      }}
                      style={{
                        padding: "0.4rem 0.8rem",
                        fontSize: "1.4rem",
                        border: "1px solid #E2E2E2",
                        borderRadius: "4px",
                        color: "#767575",
                        cursor: "pointer",
                        width: "15rem",
                      }}
                    >
                      Assign
                    </Button>
                  </li>
                ))}
              </ul>
            )}
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
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              className="date-btn"
            >
              {dueDate ? formatDate(dueDate) : "Select Date"}
            </Button>
            {showCalendar && (
              <div className="calender">
                <Calendar
                  onChange={handleDateChange}
                  value={dueDate}
                  minDate={new Date()}
                />
                <div className="react-calendar__tile--clear-today">
                  <Button onClick={handleClearDate}>Clear</Button>
                  <Button onClick={handleToday}>Today</Button>
                </div>
              </div>
            )}
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
