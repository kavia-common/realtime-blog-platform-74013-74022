import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application shell for the React app.
 * - Provides a minimal navigation bar.
 * - Renders nested routes via <Outlet />.
 */
export default function App(): JSX.Element {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          Realtime Blog
        </Link>
        <nav style={styles.nav}>
          <NavLink to="/" style={styles.link}>
            Home
          </NavLink>
          <NavLink to="/dashboard" style={styles.link}>
            Dashboard
          </NavLink>
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <small>&copy; {new Date().getFullYear()} Realtime Blog</small>
      </footer>
    </div>
  );
}

type AppStyles = {
  app: React.CSSProperties;
  header: React.CSSProperties;
  brand: React.CSSProperties;
  nav: React.CSSProperties;
  link: React.CSSProperties;
  main: React.CSSProperties;
  footer: React.CSSProperties;
};

const styles: AppStyles = {
  app: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji",
    color: "#111827",
    background: "#ffffff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #e5e7eb",
    gap: "1rem",
  },
  brand: {
    fontWeight: 700,
    color: "#2563eb",
    textDecoration: "none",
    marginRight: "auto",
  },
  nav: {
    display: "flex",
    gap: "0.75rem",
  },
  link: {
    color: "#111827",
    textDecoration: "none",
  },
  main: {
    padding: "1rem",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    padding: "0.75rem 1rem",
    color: "#6b7280",
    textAlign: "center",
  },
};
