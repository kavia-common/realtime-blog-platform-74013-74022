import React from "react";
import { Outlet } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application host. It simply renders nested routes via <Outlet />.
 * Layouts (PublicLayout, DashboardLayout) handle top navs and footers.
 */
export default function App(): JSX.Element {
  return <Outlet />;
}
