import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application shell for the React app using Tailwind classes.
 * - Provides a minimal navigation bar.
 * - Renders nested routes via <Outlet />.
 */
export default function App(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <Link to="/" className="font-bold text-primary mr-auto no-underline">
          Realtime Blog
        </Link>
        <nav className="flex gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `no-underline ${isActive ? "text-primary" : "text-foreground/80"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `no-underline ${isActive ? "text-primary" : "text-foreground/80"}`
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </header>
      <main className="px-4 py-4 max-w-[1200px] w-full mx-auto">
        <Outlet />
      </main>
      <footer className="border-t px-4 py-3 text-muted-foreground text-center">
        <small>&copy; {new Date().getFullYear()} Realtime Blog</small>
      </footer>
    </div>
  );
}
