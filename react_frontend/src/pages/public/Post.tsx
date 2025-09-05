import React from "react";
import { useParams } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Placeholder that would subscribe to a published post by slug.
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Post: {slug}</h1>
      <p className="text-sm text-muted-foreground">
        Public post viewer will render the published content here.
      </p>
    </section>
  );
}
