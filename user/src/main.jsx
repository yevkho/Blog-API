import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// css
import "./main.css"; // design themes exist,e.g., https://github.com/erynder-z/code-blog/blob/main/src/libraries/prism-laserwave.css
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

// alt routing mechanism
// see e.g., https://thedailycoder.netlify.app/

// <Route path="/" element={<Navigate replace to="/latest" />} /> // redirects from index to another path

// const routes = [
//   {
//     path: "/",
//     element: <Root />,
//     id: "root",
//     children: [
//       {
//         index: true,
//         element: currentUser ? <Navigate to="/home" replace /> : <Navigate to="/profile/login" replace />
//       },
//       {
//         path: "profile",
//         element: <Profile />,

//         children: [
//           {
//             path: "login",
//             element: <Login
//               changeUser={changeUser}
//             />,
//           },
//           {
//             path: "signup",
//             element: <SignUp />
//           }
//         ]
//       },
//       {
//         path: "home",
//         id: "homeData",
//         element: <Home />,
//         loader: () => getPublicPosts({ logout })
//       },
//       {
//         path: "viewBlog/:postId",
//         element: <BlogView />,
//         loader: ({ params }) => getSinglePost({ params, logout })
//       },
//       {
//         path: "blogDash",
//         element: <BlogDash />,
//         loader: () => getAllPosts({ logout })
//       },
//       {
//         path: "createBlog",
//         element: <CreateBlog />
//       },
//       {
//         path: "editBlog/:postId",
//         element: <EditBlog />,
//         loader: ({ params }) => getSinglePost({ params, logout })
//       }
//     ]
//   }

// ]

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
