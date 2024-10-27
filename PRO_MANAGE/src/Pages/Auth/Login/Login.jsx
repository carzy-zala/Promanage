import React, { useState } from "react";
import Button from "../../../components/Button";
import Container from "../../../components/Container";
import Input from "../../../components/Input";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { axiosPost } from "../../../service/AxiosConfig";
import { apiRoutes } from "../../../service/ApiRoutes";
import { login } from "../../../Feature/userSlice";
import setToken from "../../../utils/setToken";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigator = useNavigate();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const userEmail = useSelector((store) => store.user.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userEmail,
      password: "",
    },
  });

  const loginUser = async (data) => {
    if (!isLoading) {
      const { email, password } = data;
      setIsLoading(true);

      const response = await axiosPost(
        `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.LOGIN_USER}`,
        { email, password }
      );

      if (response.success) {
        toast.success(response.message);

        dispatch(
          login({
            name: response.data.user.name,
            email: response.data.user.email,
          })
        );

        localStorage.setItem("name",response.data.user.name)
        localStorage.setItem("email",response.data.user.email)

        setToken(response.data.accessToken, response.data.refreshToken);
        navigator("/user/board");
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }
  };
  const loginError = async (errors) => {
    for (let error in errors) {
      toast.error(errors[error].message);
    }
  };

  return (
    <div className="login-main-div">
      <div className="login-heading">Login</div>

      <form onSubmit={handleSubmit(loginUser, loginError)}>
        <div className="login-form">
          <div className="login-inputs">
            <Container className="login-input-container password-container">
              <div className="login-img-div">
                <img src="/email.svg" height="33px" width="33px" />
              </div>
              <Input
                placeholder="Email"
                id="email"
                type="email"
                {...register("email", {
                  required: "Email can't be empty",
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                })}
              />
            </Container>

            <Container className="login-input-container password-container">
              <div className="login-img-div">
                <img src="/password.svg" height="33px" width="33px" />
              </div>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                placeholder="Password"
                {...register("password", {
                  required: "Password can't be empty",
                })}
              />
              <Button
                className="password-btn"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {!showPassword && (
                  <img src="/view.svg" height="33px" width="33px" />
                )}
                {showPassword && (
                  <img src="/hide.svg" height="33px" width="33px" />
                )}
              </Button>
            </Container>
          </div>
          <div className="login-navigation-btns">
            <div>
              <Button
                className="auth-navigation-btn auth-solid-btn"
                children={
                  isLoading ? <Loader backgroundColor="white" /> : "Login"
                }
                type="submit"
              />
            </div>
            <div>
              <Button
                className="auth-navigation"
                children="Have no account yet?"
                onClick={() => {
                  navigator("/");
                }}
              />
            </div>
            <div>
              <Button
                className="auth-navigation-btn auth-outline-btn"
                children="Register"
                onClick={() => {
                  navigator("/");
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
