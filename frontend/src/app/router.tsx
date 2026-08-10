import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/features/auth/ProtectedRoute";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BeneficiariesPage from "@/features/beneficiaries/pages/BeneficiariesPage";

import ProfilePage from "@/features/profile/pages/ProfilePage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
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

          {
            path: "beneficiaries",
            element: <BeneficiariesPage />,
          },

          {
            path: "profile",
            element: <ProfilePage />,
          },

          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);
