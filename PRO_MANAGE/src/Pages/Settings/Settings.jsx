import React, { useState } from "react";
import Container from "../../components/Container.jsx";
import Input from "../../components/Input.jsx";
import "./Settings.css";
import Button from "../../components/Button.jsx";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);

  const { name, email } = useSelector((store) => store.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      email,
      password: "",
      newPassword: "",
    },
  });

  const update = async (data) => {
    console.log(data);
  };

  const updateError = async (errors) => {
    switch (Object.keys(errors)[0]) {
      case "name":
        toast.error(errors.name.message);
        break;
      case "email":
        toast.error(errors.email.message);
        break;
      case "password":
        toast.error(errors.password.message);
        break;
      case "newPassword":
        toast.error(errors.newPassword.message);
        break;
    }
  };

  return (
    <div className="settings-main-div">
      <h1>Settings</h1>

      <form onSubmit={handleSubmit(update, updateError)}>
        <div className="settings-input-fields">
          <Container className="settings-input-container">
            <div className="settings-img-div">
              <img src="/profile.svg" height="30px" width="30px" />
            </div>
            <Input
              id="name"
              placeholder="Updated Name"
              {...register("name", { required: "Name can't be empty !" })}
            />
          </Container>
          <Container className="settings-input-container">
            <div className="settings-img-div">
              <img src="/email.svg" height="30px" width="30px" />
            </div>
            <Input
              placeholder="Updated Email"
              id="email"
              type="email"
              {...register("email", {
                required: "Email can't be empty",
                pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              })}
            />
          </Container>
          <Container className="settings-input-container password-container">
            <div className="settings-img-div">
              <img src="/password.svg" height="33px" width="33px" />
            </div>
            <Input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Old Password"
              id="password"
              {...register("password", {
                required: "Please eneter your old password",
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
          <Container className="settings-input-container password-container">
            <div className="settings-img-div">
              <img src="/password.svg" height="33px" width="33px" />
            </div>
            <Input
              type={`${showNewPassword ? "text" : "password"}`}
              placeholder="New Password"
              id="newPassword"
              {...register("newPassword", {
                required: "Please enter new password !",
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
                setNewShowPassword(!showNewPassword);
              }}
            >
              {!showNewPassword && (
                <img src="/view.svg" height="33px" width="33px" />
              )}
              {showNewPassword && (
                <img src="/hide.svg" height="33px" width="33px" />
              )}
            </Button>
          </Container>
        </div>
        <div>
          <Button className="update-btn" children="Update" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default Settings;
