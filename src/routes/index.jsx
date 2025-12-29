import App from "@/App";
import ErrorFallback from "@/components/errorboundary/index";
import ProfileDialog from "@/components/shared/profile";
import AdminComponents from "@/pages/Admin";
import NotFound from "@/pages/notFound";
import { createBrowserRouter } from "react-router-dom";
import AuthRequired from "./authRequired";
import LoginRoute from "./loginRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthRequired />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "home",
            element: <AdminComponents />,
          },

          {
            path: "profile",
            element: <ProfileDialog />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
