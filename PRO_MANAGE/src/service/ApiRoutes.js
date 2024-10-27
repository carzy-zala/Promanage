const apiRoutes = {
  REGISTER_USER: "/user/register",
  LOGIN_USER: "/user/login",
  UPDATE_USER: "/user/details",
  LOGOUT_USER: "/user/logout",

  TASK_CREATE: "/task/create",
  TASK_WEEK: "/task/",
  TASK_MONTH: "/task/month",
  TASK_DAY: "/task/day",
  GET_TASK: "/task/:taskId",
  DELETE_TASK: "/task/delete/:taskId",
  EDIT_TASK: "/task/edit",
  STATE_CHANGE_TASK: "/task/state/change",

  DELETE_TODO: "/todo/delete/:todoId",
  COMPLETED_TODO: "/todo/completed/:todoId",
};

export { apiRoutes };
