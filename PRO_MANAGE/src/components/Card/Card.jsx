import React, { useEffect, useState } from "react";
import "./Card.css";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Container from "../Container.jsx";
import formatDate from "../../utils/formateDateCard.js";
import { createPortal } from "react-dom";
import Task from "../Task/Task.jsx";

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

  return dateString1 === dateString2;
}

function Card({ task, collapseAll }) {
  const { title, priority, dueDate, todos, state } = task;

  const [completedTodo, setCompletedTodo] = useState(
    todos.filter((todo) => todo.completed === true).length
  );

  const [collapseTodo, setCollapseTodo] = useState(true);
  const [dropDownClick, setDropDownClick] = useState(false);

  const [isDeleteClick, setIsDeleteClick] = useState(false);
  const [isEditClick, setIsEditClick] = useState(false);
  const [isShareClick, setIsShareClick] = useState(false);


  const handleStateChange = (taskState) =>{
     
  }

  const handleEditPortal = (value) => {
    setIsEditClick(value);
    setDropDownClick(false)
  };

  useEffect(() => {
    setCollapseTodo(true);
  }, [collapseAll]);

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
                  onClick={() => {
                    setIsShareClick(!isShareClick);
                    setTimeout(() => {
                      setIsShareClick((prev) => !prev);
                    }, 3000);
                  }}
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
                    <input type="checkbox" defaultChecked={todo.completed} />
                  </div>
                  <div>{todo.text}</div>
                </Container>
              </div>
            ))}
        </div>

        <div className="card-main-footer">
          <div>
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
          </div>
          <div className="card-main-todo-status">
            {state !== "progress" && (
              <Button className="card-main-todo-status-btn" onClick={()=>{handleStateChange("progress")}}>Progress</Button>
            )}
            {state !== "todo" && (
              <Button className="card-main-todo-status-btn" onClick={()=>{handleStateChange("todo")}}>To-Do</Button>
            )}
            {state !== "backlog" && (
              <Button className="card-main-todo-status-btn" onClick={()=>{handleStateChange("backlog")}}>Backlog</Button>
            )}
            {state !== "done" && (
              <Button className="card-main-todo-status-btn" onClick={()=>{handleStateChange("done")}}>Done</Button>
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
                  onClick={() => {
                    setDropDownClick(!dropDownClick);
                    setIsDeleteClick(!isDeleteClick);
                  }}
                />
              </div>
              <div>
                <Button
                  className="delete-cancel-btn"
                  children="Cancel"
                  onClick={() => {
                    setIsDeleteClick(!isDeleteClick);
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
            <Task handleCreatePortal={handleEditPortal} editTask={task} />
          </div>,
          document.body
        )}
    </div>
  );
}

export default Card;
