import "./App.css";
import ShareTask from "./components/ShareTask/ShareTask.jsx";
import { router } from "./Routes/index.jsx";
import { RouterProvider } from "react-router-dom";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
