import React from "react";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Simple landing page with instructions. In a full app, this would list published posts.
 */
export default function PublicHome(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Realtime Blog</h1>
      <p className="text-muted-foreground">
        Sign in to create and publish posts. Public posts are available under SEO-friendly URLs like /p/your-post-slug.
      </p>
    </section>
  );
}
