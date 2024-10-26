import "./Sidebar.css";

import React from "react";
import Button from "../Button";
import Logo from "../Logo";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav>
      <div className="nav-navbar-btns">
        <div className="nav-btns-div">
          <Logo />
        </div>
        <NavLink to="/user/board" className={ ({isActive})=> `${isActive && "selected"} nav-btn`}>
          <img src="/layout.svg" />
          Board
        </NavLink>
        <NavLink to="/user/analytics" className={ ({isActive})=> `${isActive && "selected"} nav-btn`}>
          <img src="/database.svg" />
          Analytics
        </NavLink>
        <NavLink to="/user/settings" className={ ({isActive})=> `${isActive && "selected"} nav-btn`}>
          <img src="/settings.svg" />
          Settings
        </NavLink> 
      </div>
      <div className="nav-btns-div">
        <Button className="nav-btn">
          <img src="/logout.svg" />
        </Button>
      </div>
    </nav>
  );
}

export default Sidebar;
