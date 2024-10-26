import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";

function UserLayout() {
  
  return (
    <div className="user-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default UserLayout;
