import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import "./UserLayout.css";
import { useDispatch } from "react-redux";
import { initialized, login } from "../../Feature/userSlice.js";

function UserLayout() {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigator("/login");
    } else {
      dispatch(
        login({
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
        })
      );
    }
  }, []);

  return (
    <div className="user-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default UserLayout;
