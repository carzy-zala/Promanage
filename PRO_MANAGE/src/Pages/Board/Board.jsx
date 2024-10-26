import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardSection from "../../components/CardSection/CardSection.jsx";
import "./Board.css";
import { axiosGet } from "../../service/AxiosConfig.js";
import { apiRoutes } from "../../service/ApiRoutes.js";
import axios from "axios";
import { fetchTasks } from "../../Feature/taskSlice.js";

function getFormattedDate() {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  // Return the formatted date as "12th Jan, 2024"
  return `${dayWithSuffix} ${month}, ${year}`;
}

function Board() {
  const tasks = useSelector((store) => store.tasks);
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const response = await axiosGet(
        `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.TASK_WEEK}`
      );

      if (response.success) {
        console.log(response);
        dispatch(fetchTasks({tasks:response.data.userTasks}))
      }
    })();
  });

  return (
    <div className="board-main-div">
      <div className="board-main-heading-details">
        <div className="board-welcome-greeting-message">
          <div> Welcome , {user.name}</div>
          <div className="board-today-date">{getFormattedDate()}</div>
        </div>
        <div className="board-heading-and-dropdown">
          <div className="board-heading">Board</div>
          <div className="board-select">
            <select defaultValue="week">
              <option value="day">This Day</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div className="cardsection-parent-div">
          <CardSection tasks={tasks.backlogTasks} leftsidename="Backlog" />
          <CardSection tasks={tasks.todoTasks} leftsidename="To Do" />
          <CardSection
            tasks={tasks.inProgressTasks}
            leftsidename="In Progress"
          />
          <CardSection tasks={tasks.completedTasks} leftsidename="Done" />
        </div>
      </div>
    </div>
  );
}

export default Board;
