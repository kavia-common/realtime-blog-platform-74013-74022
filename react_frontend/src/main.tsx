import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";

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
        element: <div>Dashboard (placeholder)</div>,
      },
      {
        path: "/posts/:slug",
        element: <div>Public Post Viewer (placeholder)</div>,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
