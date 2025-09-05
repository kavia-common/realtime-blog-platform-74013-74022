import React from "react";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Simple landing placeholder.
 */
export default function PublicHome(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Realtime Blog</h1>
      <p className="text-sm text-muted-foreground">
        Create and publish posts in real time. Use the Dashboard to get started.
      </p>
    </section>
  );
}
