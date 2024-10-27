import React, { useEffect, useState } from "react";
import "./ShareTask.css";
import Input from "../Input";
import formatDate from "../../utils/formateDateCard";
import { axiosGet } from "../../service/AxiosConfig";
import { apiRoutes } from "../../service/ApiRoutes";
import { useParams } from "react-router-dom";

function ShareTask() {
  const [task, setTask] = useState({
    title: "Jayraj's First Task",
    priority: "high",
    assignTo: [],
    dueDate: "2024-10-27T04:34:31.635Z",
    owner: "671d731d95bcdd4a466c86a4",
    state: "todo",
    createdAt: "2024-10-27T04:34:31.635Z",
    updatedAt: "2024-10-27T04:34:31.635Z",
    __v: 0,
    todos: [
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
      {
        _id: "671dc2d76d2a9337af1bf684",
        text: "First Todo",
        completed: true,
        __v: 0,
      },
    ],
  });
  const [error, setError] = useState(null);
  const { taskId } = useParams();

  useEffect(() => {
    (async () => {
      const response = await axiosGet(
        `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.GET_TASK}`.replace(
          ":taskId",
          taskId
        )
      );

      if (response.success) {
        // setTask(response.data.task);
      } else {
        setError(response.message);
      }
    })();
  }, []);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div className="share-task-main-div">
          <div className="share-task-div">
            <div className="share-task-heading">
              <div className="share-priority">
                <div
                  className="share-priority-circle"
                  style={{
                    backgroundColor:
                      task.priority === "high"
                        ? "#FF2473"
                        : task.priority === "low"
                        ? "#63C05B"
                        : "#18B0FF",
                  }}
                ></div>
                <div>
                  {task.priority === "high"
                    ? "HIGH "
                    : task.priority === "low"
                    ? "LOW "
                    : "MODERATE "}
                  PRIORITY
                </div>
              </div>
              <div className="share-task-title">{task.title}</div>
            </div>

            <div className="share-task-bottom">
              <div className="share-task-checklist-heading">
                Checklist ( {0} / {task.todos.length} )
              </div>
              <div className="share-todos">
                {task.todos.map((todo) => (
                  <div key={todo._id} className="share-todo-container">
                    <Input
                      className="checkbox"
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                    />
                    <div className="share-task-todo">{todo.text}</div>
                  </div>
                ))}
              </div>
              {task.dueDate && (
                <div className="share-task-duedate">
                  Due Date{" "}
                  <div className="share-task-duedate-btn">
                    {" "}
                    {formatDate(task.dueDate)}{" "}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareTask;
