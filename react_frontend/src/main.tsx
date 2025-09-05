import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App";
import { ProtectedRoute, SignInPage, SignUpPage, AppAuthProvider } from "./auth/clerk";
import { AppConvexProvider } from "./providers/ConvexProvider";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicHome from "./pages/public/Home";
import PublicPostPage from "./pages/public/Post";
import DashboardHome from "./pages/dashboard/Home";
import EditorPage from "./pages/dashboard/Editor";
import SettingsPage from "./pages/dashboard/Settings";

// ROUTES
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public site layout
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <PublicHome /> },
          { path: "p/:slug", element: <PublicPostPage /> },
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
        ],
      },
      // Dashboard (protected) layout
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <DashboardHome /> },
          { path: "editor/:postId", element: <EditorPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
      // Catch-all
      {
        path: "*",
        element: <div className="p-6">Not Found</div>,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Clerk MUST wrap Convex, so Convex can use useAuth */}
      <AppAuthProvider>
        <AppConvexProvider>
          <RouterProvider router={router} />
        </AppConvexProvider>
      </AppAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
