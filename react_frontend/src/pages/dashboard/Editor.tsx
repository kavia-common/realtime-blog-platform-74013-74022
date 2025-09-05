import React from "react";
import { useParams } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * EditorPage
 * The post editor scaffold. Supports creating a new post or editing an existing one.
 * - Route: /editor/:postId
 *   - postId can be "new" for new post flow or a specific id.
 */
export default function EditorPage(): JSX.Element {
  const { postId } = useParams<{ postId: string }>();

  const isNew = !postId || postId === "new";

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isNew ? "Create New Post" : `Edit Post: ${postId}`}
        </h1>
      </header>
      <div className="text-sm text-muted-foreground">
        Editor UI coming soon (TipTap/CodeMirror integration planned).
      </div>
      <div className="border rounded-md p-4">
        <p className="text-sm">
          Placeholder editor canvas. This will include title, content, image uploads, and toolbar.
        </p>
      </div>
    </section>
  );
}
