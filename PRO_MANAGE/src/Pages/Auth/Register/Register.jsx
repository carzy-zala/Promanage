import React, { useState } from "react";
import Container from "../../../components/Container.jsx";
import Button from "../../../components/Button.jsx";
import Input from "../../../components/Input.jsx";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader.jsx";
import { apiRoutes } from "../../../service/ApiRoutes.js";
import { axiosPost } from "../../../service/AxiosConfig.js";
import { useDispatch } from "react-redux";
import { registerUserAction } from "../../../Feature/userSlice.js";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cfPass: "",
    },
  });

  const registerUser = async (data) => {
    if (!isLoading) {
      setIsLoading(true);
      const { name, email, password } = data;

      const response = await axiosPost(
        `${import.meta.env.VITE_BACKEND_API_URL}${apiRoutes.REGISTER_USER}`,
        { name, email, password }
      );

      if (response.success) {
        toast.success(response.message);
        dispatch(registerUserAction({ email: response.data.email }));
        navigator("/login");
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }
  };

  const registerUserError = (errors) => {
    for (let error in errors) {
      toast.error(errors[error].message);
    }
  };

  return (
    <div className="register-main-div">
      <div className="register-heading">Register</div>

      <form onSubmit={handleSubmit(registerUser, registerUserError)}>
        <div className="register-form">
          <div className="register-inputs">
            <Container className="register-input-container">
              <div className="register-img-div">
                <img src="/profile.svg" height="30px" width="30px" />
              </div>
              <Input
                id="name"
                placeholder="Name"
                {...register("name", { required: "Name can't be empty !" })}
              />
            </Container>
            <Container className="register-input-container password-container">
              <div className="register-img-div">
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

            <Container className="register-input-container password-container">
              <div className="register-img-div">
                <img src="/password.svg" height="33px" width="33px" />
              </div>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                placeholder="Password"
                id="password"
                {...register("password", {
                  required: "Password can't be empty",
                  validate: (value) => {
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumber = /\d/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                    const minLength = value.length >= 8;

                    if (!minLength) {
                      return "Password must be at least 8 characters long";
                    } else if (!hasUpperCase) {
                      return "Password must contain at least one uppercase letter";
                    } else if (!hasLowerCase) {
                      return "Password must contain at least one lowercase letter";
                    } else if (!hasNumber) {
                      return "Password must contain at least one number";
                    } else if (!hasSpecialChar) {
                      return "Password must contain at least one special character";
                    }

                    return true; // Valid password
                  },
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

            <Container className="register-input-container password-container">
              <div className="register-img-div">
                <img src="/password.svg" height="33px" width="33px" />
              </div>
              <Input
                id="cfPass"
                type={`${showConfirmPassword ? "text" : "password"}`}
                placeholder="Confirm Password"
                {...register("cfpass", {
                  required: "Password doesn't match",
                  validate: (value) =>
                    value === watch("password") || "Password doesn't match ",
                })}
              />
              <Button
                className="password-btn"
                onClick={() => {
                  setConfirmShowPassword(!showConfirmPassword);
                }}
              >
                {!showConfirmPassword && (
                  <img src="/view.svg" height="33px" width="33px" />
                )}
                {showConfirmPassword && (
                  <img src="/hide.svg" height="33px" width="33px" />
                )}
              </Button>
            </Container>
          </div>
          <div className="register-navigation-btns">
            <div>
              <Button
                className="auth-navigation-btn auth-solid-btn"
                children={
                  isLoading ? <Loader backgroundColor="white" /> : "Register"
                }
                type="submit"
              />
            </div>
            <div>
              <Button
                className="auth-navigation"
                children="Have an account ?"
                onClick={() => {
                  navigator("/login");
                }}
              />
            </div>
            <div>
              <Button
                className="auth-navigation-btn auth-outline-btn"
                children="Login"
                onClick={() => {
                  navigator("/login");
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
