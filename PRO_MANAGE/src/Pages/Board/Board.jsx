import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardSection from "../../components/CardSection/CardSection.jsx";
import "./Board.css";
import { fetchTasks } from "../../Feature/taskSlice.js";
import Button from "../../components/Button.jsx";
import { createPortal } from "react-dom";
import Input from "../../components/Input.jsx";
import { toast } from "react-toastify";

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

  const [addPeopleClick, setAddPeopleClick] = useState(false);
  const [addEmailClick, setAddEmailClick] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const handleSelectChange = (event) => {
    if (event.target.value === "week") {
      dispatch(fetchTasks());
    } else {
      if (event.target.value === "day") {
        dispatch(fetchTasks(1));
      } else {
        dispatch(fetchTasks(30));
      }
    }
  };

  return (
    <div className="board-main-div">
      <div className="board-main-heading-details">
        <div className="board-welcome-greeting-message">
          <div> Welcome , {user.name}</div>
          <div className="board-today-date">{getFormattedDate()}</div>
        </div>
        <div className="board-heading-and-dropdown">
          <div className="board-heading">
            Board{" "}
            <Button
              className="add-people-btn"
              onClick={() => setAddPeopleClick(true)}
            >
              <img src="/addPeople.png" />
            </Button>
          </div>
          <div className="board-select">
            <select
              defaultValue={
                tasks.selectedTime === 7
                  ? "week"
                  : tasks.selectedTime === 1
                  ? "day"
                  : "month"
              }
              onChange={handleSelectChange}
            >
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

      {addPeopleClick &&
        !addEmailClick &&
        createPortal(
          <div className="portal-div">
            <div className="add-people-main-div">
              <div className="add-people-heading">Add people to the board</div>

              <Input
                className="add-people-email"
                type="email"
                placeholder="Enter the email"
                onChange={handleEmail}
              />

              <div className="add-people-lower-btns">
                <div>
                  <Button
                    className="add-people-cancel-btn"
                    children="Cancel"
                    onClick={() => {
                      setAddPeopleClick(false);
                    }}
                  />
                </div>
                <div>
                  <Button
                    className="add-people-confirm-btn"
                    children="Add Email"
                    onClick={() => {
                      if (email) {
                        setAddEmailClick(true);
                      } else {
                        toast.error("Please enter email !");
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {addPeopleClick &&
        addEmailClick &&
        createPortal(
          <div className="portal-div">
            <div className="add-people-main-div-lower">
              <div className="add-people-heading">{email} added to board</div>

              <div>
                <Button
                  className="add-people-confirm-btn"
                  children="Okay, got it!"
                  onClick={() => {
                    setAddPeopleClick(false);
                    setAddEmailClick(false);
                    setEmai("");
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Board;
