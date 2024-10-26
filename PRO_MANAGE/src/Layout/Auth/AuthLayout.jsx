import React from "react";
import Container from "../../components/Container.jsx";
import "./AuthLayout.css";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Container className="auth-layout">
      <img src="/auth.svg" className="auth-img" />
      <Outlet />
    </Container>
  );
}

export default AuthLayout;
