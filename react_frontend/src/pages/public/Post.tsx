import React from "react";
import { useParams } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Shows a published post to the public by slug.
 * - Route: /p/:slug
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  return (
    <article className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold break-words">Post: {slug}</h1>
        <p className="text-sm text-muted-foreground">Author info and publish date coming soon.</p>
      </header>
      <div className="prose max-w-none">
        <p>This is a placeholder public post view. Content rendering will be added later.</p>
      </div>
    </article>
  );
}
