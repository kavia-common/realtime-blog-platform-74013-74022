import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthControls } from "../auth/clerk";
import { FadeIn } from "../components/animations/FadeIn";

/**
 * PUBLIC_INTERFACE
 * DashboardLayout
 * Provides the private application layout for dashboard routes.
 * - TopNav with brand and auth controls
 * - SideNav with primary navigation
 * - Main content area rendering nested routes via <Outlet />
 */
export default function DashboardLayout(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <TopNav />
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <SideNav />
        <main className="p-4 md:p-6" aria-label="Dashboard main content">
          <FadeIn>
            <Outlet />
          </FadeIn>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TopNav() {
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3" role="banner">
      <div className="mr-auto font-bold text-primary">
        <NavLink to="/" aria-label="Go to homepage">Realtime Blog</NavLink>
      </div>
      <nav className="flex gap-3 text-sm" aria-label="Primary navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "text-primary" : "text-foreground/80"}`
          }
        >
          Public
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "text-primary" : "text-foreground/80"}`
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

// PUBLIC_INTERFACE
export function SideNav() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      isActive ? "bg-muted text-foreground" : "text-foreground/80 hover:text-foreground"
    }`;
  return (
    <aside className="border-r p-3 md:p-4 min-h-[calc(100vh-57px)]" aria-label="Sidebar navigation">
      <div className="text-xs uppercase text-muted-foreground mb-2">Manage</div>
      <nav className="space-y-1">
        <NavLink to="/dashboard" end className={linkCls}>
          {({ isActive }) => (
            <span aria-current={isActive ? "page" : undefined}>Overview</span>
          )}
        </NavLink>
        <NavLink to="/editor/new" className={linkCls as any}>
          New Post
        </NavLink>
        <NavLink to="/settings" className={linkCls as any}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
