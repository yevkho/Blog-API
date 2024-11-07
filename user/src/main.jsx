import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// css
import "./main.css";
// components
import App from "./App.jsx";
import Signup from "./Pages/Signup.jsx";
import Home from "./Pages/Home.jsx";
import Post from "./Pages/Post.jsx";
import Login from "./Pages/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // <RootLayout/>
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true, // path: "/" or Default route
        element: <Home />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: ":postId",
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
