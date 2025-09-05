import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/ui/navbar";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application shell for the React app using Tailwind classes.
 * - Provides a minimal navigation bar with auth controls.
 * - Renders nested routes via <Outlet />.
 */
export default function App(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Navbar
        items={[
          { to: "/", label: "Home" },
          { to: "/dashboard", label: "Dashboard" },
        ]}
      />
      <main className="px-4 py-4 max-w-[1200px] w-full mx-auto">
        <Outlet />
      </main>
      <footer className="border-t px-4 py-3 text-muted-foreground text-center">
        <small>&copy; {new Date().getFullYear()} Realtime Blog</small>
      </footer>
    </div>
  );
}
