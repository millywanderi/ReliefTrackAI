import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LoginPage from "@/features/auth/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);
