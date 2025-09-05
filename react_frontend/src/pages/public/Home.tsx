import React from "react";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Public landing page that will later list published posts, tags, and search.
 */
export default function PublicHome(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Realtime Blog</h1>
      <p className="text-sm text-muted-foreground">
        Discover published posts from creators. This feed will be powered by Convex.
      </p>
    </section>
  );
}
