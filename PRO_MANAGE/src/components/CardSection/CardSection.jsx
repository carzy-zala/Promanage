import React, { useEffect, useState } from "react";
import "./CardSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button.jsx";
import Card from "../Card/Card.jsx";
import { createPortal } from "react-dom";
import Task from "../Task/Task.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../Feature/taskSlice.js";

function CardSection({ tasks = [], leftsidename, ...props }) {
  const [allCollapse, setAllCollapse] = useState(false);
  const [createTaskClick, setCreateTaskClick] = useState(false);
  const selectedTime = useSelector(store => store.tasks.selectedTime)

  const dispatch = useDispatch();

  const handleCreatePortal = (value) => {
    setCreateTaskClick(value);    
    dispatch(fetchTasks(selectedTime));
  };

  return (
    <div>
      <div key={leftsidename} className="card-section-div" {...props}>
        <div className="card-section-div-header">
          <div className="card-section-leftname">{leftsidename}</div>
          <div className="card-section-header-btns">
            {leftsidename === "To Do" && (
              <div>
                <Button
                  onClick={() => setCreateTaskClick(!createTaskClick)}
                  style={{ border: "none" }}
                >
                  <FontAwesomeIcon icon={faPlus} size="xl" />
                </Button>
              </div>
            )}
            <div>
              <Button
                className="card-main-collapse-all-btn"
                onClick={() => setAllCollapse(!allCollapse)}
              >
                <img src="/collapse.svg" />
              </Button>
            </div>
          </div>
        </div>
        <div className="card-section-tasks">
          {tasks.length ? (
            tasks.map((task) => {
              return (
                <div key={task._id}>
                  <Card task={task} collapseAll={allCollapse} />
                </div>
              );
            })
          ) : (
            <div className="no-text">No tasks added yet ...</div>
          )}
        </div>
      </div>
      {createTaskClick &&
        createPortal(
          <div className="portal-div">
            <Task handleCreatePortal={handleCreatePortal} />
          </div>,
          document.body
        )}
    </div>
  );
}

export default CardSection;
