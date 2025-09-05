import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application host. It renders nested routes with subtle page transitions.
 * Layouts (PublicLayout, DashboardLayout) handle top navs and footers.
 */
export default function App(): JSX.Element {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        id="main-content"
        role="main"
        aria-live="polite"
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </AnimatePresence>
  );
}
