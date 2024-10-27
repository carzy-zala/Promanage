import "./Sidebar.css";
import React, { useState } from "react";
import Button from "../Button";
import Logo from "../Logo";
import Loader from "../Loader/Loader.jsx"
import { NavLink, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { axiosGet } from "../../service/AxiosConfig";
import { apiRoutes } from "../../service/ApiRoutes";
import { toast } from "react-toastify";
import setToken from "../../utils/setToken.js";

function Sidebar() {
  const [isLogoutClick, setIsLogoutClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  const handleLogout = async () => {
    if (!isLoading) {
      setIsLoading(true);

      const response = await axiosGet(
        `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.LOGOUT_USER}`
      );


      if (response.success) {
        toast.success(response.message);
        navigator("/login");
        setToken()
        setIsLogoutClick(false);
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }
  };

  return (
    <nav>
      <div className="nav-navbar-btns">
        <div className="nav-btns-div">
          <Logo />
        </div>
        <NavLink
          to="/user/board"
          className={({ isActive }) => `${isActive && "selected"} nav-btn`}
        >
          <img src="/layout.svg" />
          Board
        </NavLink>
        <NavLink
          to="/user/analytics"
          className={({ isActive }) => `${isActive && "selected"} nav-btn`}
        >
          <img src="/database.svg" />
          Analytics
        </NavLink>
        <NavLink
          to="/user/settings"
          className={({ isActive }) => `${isActive && "selected"} nav-btn`}
        >
          <img src="/settings.svg" />
          Settings
        </NavLink>
      </div>
      <div className="nav-btns-div">
        <Button className="nav-btn" onClick={() => setIsLogoutClick(true)}>
          <img src="/logout.svg" />
        </Button>
      </div>
      {isLogoutClick &&
        createPortal(
          <div className="portal-div">
            <div className="delete-main-div">
              <div className="delete-heading">
                Are you sure you want to Logout?
              </div>
              <div>
                <Button
                  className="delete-confirm-btn"
                  children={
                    isLoading ? (
                      <Loader backgroundColor="white" />
                    ) : (
                      "Yes, Logout"
                    )
                  }
                  onClick={handleLogout}
                />
              </div>
              <div>
                <Button
                  className="delete-cancel-btn"
                  children="Cancel"
                  onClick={() => {
                    setIsLogoutClick(false);
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
        
    </nav>
  );
}

export default Sidebar;
