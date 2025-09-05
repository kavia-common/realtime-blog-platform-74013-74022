import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthControls } from "../auth/clerk";
import { FadeIn } from "../components/animations/FadeIn";

/**
 * PUBLIC_INTERFACE
 * PublicLayout
 * Provides a simple public site layout with top navigation and footer.
 */
export default function PublicLayout(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <PublicTopNav />
      <main className="px-4 py-6 max-w-[1200px] w-full mx-auto" aria-label="Main content area">
        <FadeIn>
          <Outlet />
        </FadeIn>
      </main>
      <footer className="border-t px-4 py-3 text-muted-foreground text-center" role="contentinfo">
        <small>&copy; {new Date().getFullYear()} Realtime Blog</small>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
export function PublicTopNav() {
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3" role="banner">
      <div className="mr-auto font-bold text-primary">
        <NavLink to="/" aria-label="Go to homepage">Realtime Blog</NavLink>
      </div>
      <nav className="flex gap-3 text-sm" aria-label="Primary navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${isActive ? "text-primary" : "text-foreground/80"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${isActive ? "text-primary" : "text-foreground/80"}`
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
