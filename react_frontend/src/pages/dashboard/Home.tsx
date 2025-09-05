import React from "react";

/**
 * PUBLIC_INTERFACE
 * DashboardHome
 * Default dashboard landing page that will later list user posts and actions.
 */
export default function DashboardHome(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Welcome to your dashboard. Create, edit, and manage your posts.
      </p>
    </section>
  );
}
