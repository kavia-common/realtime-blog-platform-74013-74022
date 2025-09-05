import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AppAuthProvider, ProtectedRoute, SignInPage, SignUpPage } from "./auth/clerk";
import { AppConvexProvider } from "./providers/ConvexProvider";

// PUBLIC_INTERFACE
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <div>Dashboard (placeholder)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/posts/:slug",
        element: <div>Public Post Viewer (placeholder)</div>,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "*",
        element: <div>Not Found</div>,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AppAuthProvider>
      <AppConvexProvider>
        <RouterProvider router={router} />
      </AppConvexProvider>
    </AppAuthProvider>
  </React.StrictMode>
);
