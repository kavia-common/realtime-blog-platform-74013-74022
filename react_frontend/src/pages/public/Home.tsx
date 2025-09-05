import React from "react";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Placeholder public home page. In a later task it can list published posts.
 */
export default function PublicHome(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="text-sm text-muted-foreground">
        This is the public home. Visit the Dashboard to create and edit posts.
      </p>
    </section>
  );
}
