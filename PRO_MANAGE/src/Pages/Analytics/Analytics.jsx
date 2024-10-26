import React from "react";
import "./Analytics.css";
import { useSelector } from "react-redux";

function Analytics() {
  const taskDetail = useSelector((store) => store.tasks);

  return (
    <div style={{ padding: "0 2rem" }}>
      <h1>Analytics</h1>
      <div className="analytics-main-div">
        <div className="analytics-inner-main-div">
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">Backlog Tasks</div>
            <div className="analytics-value">{taskDetail.backlogTask}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">To-do Tasks</div>
            <div className="analytics-value">{taskDetail.todoTask}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">In-Progress Tasks</div>
            <div className="analytics-value">{taskDetail.inProgressTask}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">Completed Tasks</div>
            <div className="analytics-value">{taskDetail.completedTask}</div>
          </div>
        </div>
        <div className="analytics-inner-main-div">
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">Low Priority</div>
            <div className="analytics-value">{taskDetail.lowPriority}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">Moderate Priority</div>
            <div className="analytics-value">{taskDetail.modPriority}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">High Priority</div>
            <div className="analytics-value">{taskDetail.highPriority}</div>
          </div>
          <div className="analytics-details-div">
            <div className="analytics-circle"></div>
            <div className="analytics-heading">Due Date Tasks</div>
            <div className="analytics-value">{taskDetail.dueDateTask}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
