import User from "../models/user.model.js";
import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";

//#region Token genration

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "ERROR :: Something went wrong while generating your token !"
    );
  }
};

//#endregion

//#region  Register user

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field.trim === "")) {
    throw new ApiError(
      400,
      "ERROR :: All fields name,email and password are compalsory !!"
    );
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(
      400,
      "ERROR :: Your email is already register with us !"
    );
  }

  const user = await User.create({
    name: name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(
      500,
      "ERROR :: Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

//#endregion

//#region  Login user

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "ERROR :: Please enter credentials properly !!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      405,
      "ERROR :: You are not register with us ! Please register !!"
    );
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "ERROR :: Invalid credentials !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        `Welcome , ${loggedInUser.name.toUpperCase()}`
      )
    );
});

//#endregion

//#region  user detalis

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, email, password, newPassword } = req.body;

  const user = await User.findById(_id).select("-refreshToken");

  if (!user) {
    throw new ApiError(400, "ERROR :: User not found !");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "ERORR :: Invalid old password !");
  }

  user.name = name;
  user.email = email;
  user.password = newPassword;

  await user.save();

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: newUser },
        "User details fetched succesfully !"
      )
    );
});

//#endregion

//#region logout

export const logout = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, {}, "User logout succesfully !"));
});

//#endregion

