import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthControls } from "../auth/clerk";

/**
 * PUBLIC_INTERFACE
 * PublicLayout
 * Provides a simple public site layout with top navigation and footer.
 */
export default function PublicLayout(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <PublicTopNav />
      <main className="px-4 py-6 max-w-[1200px] w-full mx-auto">
        <Outlet />
      </main>
      <footer className="border-t px-4 py-3 text-muted-foreground text-center">
        <small>&copy; {new Date().getFullYear()} Realtime Blog</small>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
export function PublicTopNav() {
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3">
      <div className="mr-auto font-bold text-primary">
        <NavLink to="/">Realtime Blog</NavLink>
      </div>
      <nav className="flex gap-3 text-sm">
        <NavLink
          to="/"
          end
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
      <div className="ml-2">
        <AuthControls />
      </div>
    </header>
  );
}
