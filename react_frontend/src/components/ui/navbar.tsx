import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthControls } from "../../auth/clerk";

// PUBLIC_INTERFACE
export interface NavbarProps {
  brand?: React.ReactNode;
  items?: Array<{ to: string; label: string }>;
  right?: React.ReactNode;
}

/** PUBLIC_INTERFACE
 * Minimal Navbar primitive consistent with theme tokens. Includes auth controls on the right.
 */
export function Navbar({ brand, items = [], right }: NavbarProps) {
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3">
      <div className="mr-auto font-bold text-primary">
        {brand ?? <Link to="/">Realtime Blog</Link>}
      </div>
      <nav className="flex gap-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `no-underline ${isActive ? "text-primary" : "text-foreground/80"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-2 flex items-center gap-3">
        <AuthControls />
        {right ? <div>{right}</div> : null}
      </div>
    </header>
  );
}
