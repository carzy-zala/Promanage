import { createBrowserRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import AuthLayout from "../Layout/Auth/AuthLayout.jsx";
import Login from "../Pages/Auth/Login/Login.jsx";
import Register from "../Pages/Auth/Register/Register.jsx"
import UserLayout from "../Layout/User/UserLayout.jsx";
import Analytics from "../Pages/Analytics/Analytics.jsx"
import Settings from "../Pages/Settings/Settings.jsx"
import Board from "../Pages/Board/Board.jsx"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "settings",
        element: <Settings />
      }
    ],
  },
]);
