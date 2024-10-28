import React, { useEffect, useState } from "react";
import "./Card.css";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Container from "../Container.jsx";
import formatDate from "../../utils/formateDateCard.js";
import { createPortal } from "react-dom";
import Task from "../Task/Task.jsx";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
} from "../../service/AxiosConfig.js";
import { apiRoutes } from "../../service/ApiRoutes.js";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../Feature/taskSlice.js";

function isSameDate(date1, timeZone = "Asia/Kolkata") {
  const date2 = new Date();
  const options = {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const dateString1 = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date1)
  );
  const dateString2 = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date2)
  );

  return dateString1 <= dateString2;
}

function Card({ task, collapseAll }) {
  const { title, priority, dueDate, todos, state } = task;
  const selectedTime = useSelector((store) => store.tasks.selectedTime);

  const [completedTodo, setCompletedTodo] = useState(
    todos.filter((todo) => todo.completed === true).length
  );

  const [collapseTodo, setCollapseTodo] = useState(true);
  const [dropDownClick, setDropDownClick] = useState(false);
  const [isDeleteClick, setIsDeleteClick] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [isEditClick, setIsEditClick] = useState(false);
  const [isShareClick, setIsShareClick] = useState(false);
  const dispatch = useDispatch();

  const handleStateChange = async (taskState) => {
    const response = await axiosPatch(
      `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.STATE_CHANGE_TASK}`,
      {
        taskId: task._id,
        newState: taskState,
      }
    );

    if (response.success) {
      dispatch(fetchTasks(selectedTime));
    } else {
      toast.error(response.message);
    }
  };

  const handleEditPortal = (value) => {
    setCompletedTodo();
    setIsEditClick(value);
    setDropDownClick(false);
  };

  useEffect(() => {
    setCompletedTodo(todos.filter((todo) => todo.completed === true).length);
  }, [handleEditPortal]);

  const handleDeleteTask = async () => {
    setDropDownClick(false);

    if (!isDeleteLoading) {
      setIsDeleteLoading(true);

      const response = await axiosDelete(
        `${import.meta.env.VITE_BACKEND_API_URL}${
          apiRoutes.DELETE_TASK
        }`.replace(":taskId", task._id)
      );

      if (response.success) {
        toast.success(response.message);
        dispatch(fetchTasks(selectedTime));
      } else {
        toast.error(response.message);
      }
      setIsDeleteLoading(false);
      setIsDeleteClick(false);
    }
  };

  const handleTodoComplete = async (todoId) => {
    if (!isCompletedLoading) {
      setIsCompletedLoading(true);

      const response = await axiosGet(
        `${import.meta.env.VITE_BACKEND_API_URL}${
          apiRoutes.COMPLETED_TODO
        }`.replace(":todoId", todoId)
      );

      if (response.success) {
        const updatedTodos = todos.map((todo) =>
          todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
        );
        setCompletedTodo(updatedTodos.filter((todo) => todo.completed).length);

        dispatch(fetchTasks(selectedTime));
      } else {
        toast.error(response.message);
      }
      setIsCompletedLoading(false);
    }
  };

  useEffect(() => {
    setCollapseTodo(true);
  }, [collapseAll]);

  const handleShare = () => {
    const textToCopy = window.location.origin + "/task/" + task._id;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsShareClick(!isShareClick);
        setTimeout(() => {
          setIsShareClick((prev) => !prev);
        }, 3000);
        setDropDownClick(false);
      })
      .catch((err) => {
        setIsShareClick(!isShareClick);
        setTimeout(() => {
          setIsShareClick((prev) => !prev);
        }, 3000);
      });
  };

  return (
    <div>
      {isShareClick && <div className="share-toast">Link Copied</div>}
      <div key={task._id} className="card-main-div">
        <div className="card-main-heading">
          <div className="card-main-priority">
            <div
              className={`${
                priority === "high"
                  ? "high card-circle"
                  : priority === "mod"
                  ? "mod card-circle"
                  : "low card-circle"
              }`}
            ></div>
            {priority === "high"
              ? "HIGH PRIORITY"
              : priority === "mod"
              ? "MODERATE PRIORITY"
              : "LOW PRIORITY"}
            <div className="assigned-circles">
              {task.assignTo.map((person,index) => (
                <div key={index} className="assigned-circle" style={{
                  backgroundColor : index%2 ? "#ff2473" : index%5 ? "#17a2b8" : "#48c1b5"
                }}>{person[0]}</div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Button
              className="card-edit-btn"
              onClick={() => {
                setDropDownClick(!dropDownClick);
              }}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </Button>
            {dropDownClick && (
              <div className="card-edit-content">
                <Button
                  children="Edit"
                  className="card-edit-content-btn"
                  onClick={() => {
                    setIsEditClick(true);
                  }}
                />
                <Button
                  children="Share"
                  className="card-edit-content-btn"
                  onClick={handleShare}
                />
                <Button
                  children="Delete"
                  className="card-edit-content-btn"
                  style={{ color: "#CF3636" }}
                  onClick={() => setIsDeleteClick(!isDeleteClick)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="card-main-title">{title}</div>

        <div
          className="card-main-todos"
          style={{ gap: !collapseTodo && "1rem" }}
        >
          <div className="card-main-todo">
            Checklist {`${completedTodo}/${todos.length}`}
            <Button
              className="card-main-collapase-btn"
              onClick={() => setCollapseTodo(!collapseTodo)}
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                rotation={!collapseTodo ? 180 : 0}
              />
            </Button>
          </div>
          {!collapseTodo &&
            todos.map((todo) => (
              <div key={todo._id} className="card-main-todo-grid">
                <Container className="todo">
                  <div className="todo-checkbox">
                    <input
                      type="checkbox"
                      defaultChecked={todo.completed}
                      onChange={() => handleTodoComplete(todo._id)}
                    />
                  </div>
                  <div>{todo.text}</div>
                </Container>
              </div>
            ))}
        </div>

        <div className="card-main-footer">
          <div>
            {dueDate && (
              <Button
                className={`${
                  isSameDate(dueDate) &&
                  priority === "high" &&
                  state !== "done" &&
                  "red-background"
                } ${
                  state === "done" && "green-background"
                }  card-main-todo-status-btns `}
              >
                {formatDate(dueDate)}
              </Button>
            )}
          </div>
          <div className="card-main-todo-status">
            {state !== "progress" && (
              <Button
                className="card-main-todo-status-btn"
                onClick={() => {
                  handleStateChange("progress");
                }}
              >
                Progress
              </Button>
            )}
            {state !== "todo" && (
              <Button
                className="card-main-todo-status-btn"
                onClick={() => {
                  handleStateChange("todo");
                }}
              >
                To-Do
              </Button>
            )}
            {state !== "backlog" && (
              <Button
                className="card-main-todo-status-btn"
                onClick={() => {
                  handleStateChange("backlog");
                }}
              >
                Backlog
              </Button>
            )}
            {state !== "done" && (
              <Button
                className="card-main-todo-status-btn"
                onClick={() => {
                  handleStateChange("done");
                }}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>

      {isDeleteClick &&
        createPortal(
          <div className="portal-div">
            <div className="delete-main-div">
              <div className="delete-heading">
                Are you sure you want to Delete?
              </div>
              <div>
                <Button
                  className="delete-confirm-btn"
                  children="Yes, Delete"
                  onClick={handleDeleteTask}
                />
              </div>
              <div>
                <Button
                  className="delete-cancel-btn"
                  children="Cancel"
                  onClick={() => {
                    setIsDeleteClick(true);
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {isEditClick &&
        createPortal(
          <div className="portal-div">
            <Task
              handleCreatePortal={handleEditPortal}
              isEditTask={true}
              editTask={task}
            />
          </div>,
          document.body
        )}
    </div>
  );
}

export default Card;
