import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import "./UserLayout.css";
import { useDispatch } from "react-redux";
import { initialized, login } from "../../Feature/userSlice.js";
import axioInstance from "../../service/axios.js";

function UserLayout() {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigator("/login");
    } else {
      dispatch(initialized());
      dispatch(
        login({
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
        })
      );

      axioInstance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
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
