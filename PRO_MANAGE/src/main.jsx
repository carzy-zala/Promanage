import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import store from "./Store/Store.js"
import {Provider} from "react-redux"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
      <ToastContainer autoClose={2000} />
    </Provider>
  </StrictMode>
);
