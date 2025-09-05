import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import RichEditor, { TipTapJSON } from "../../components/editor/Editor";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

/**
 * PUBLIC_INTERFACE
 * EditorPage
 * The post editor with TipTap integration. Supports creating a new post or editing an existing one.
 * - Route: /editor/:postId
 *   - postId can be "new" for new post flow or a specific id.
 * Emits TipTap JSON on content changes.
 */
export default function EditorPage(): JSX.Element {
  const { postId } = useParams<{ postId: string }>();
  const isNew = !postId || postId === "new";

  // Local state to simulate a post draft.
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<TipTapJSON | null>(null);

  // Placeholder: integrate with future UploadThing or Convex storage
  const handleUploadImage = useCallback(async (file: File) => {
    // For now, create an object URL so the editor can embed the image.
    // Next step: replace with actual upload pipeline and return the uploaded URL.
    const objectUrl = URL.createObjectURL(file);
    return objectUrl;
  }, []);

  const handleContentChange = useCallback((doc: TipTapJSON) => {
    setContent(doc);
  }, []);

  const handleSave = useCallback(() => {
    // In the next steps, this will call a Convex mutation (posts:createPost or posts:updatePost)
    // with { title, content: JSON.stringify(content) } and other fields.
    console.log("Saving draft:", {
      postId,
      title,
      content,
    });
    alert("Draft save simulated. Check console for JSON payload.");
  }, [content, postId, title]);

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {isNew ? "Create New Post" : `Edit Post: ${postId}`}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>Save Draft</Button>
        </div>
      </header>

      <div className="space-y-2">
        <label htmlFor="post-title" className="text-sm text-muted-foreground">
          Title
        </label>
        <Input
          id="post-title"
          placeholder="My awesome blog post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <RichEditor
          initialContent={content ?? undefined}
          onChange={handleContentChange}
          onUploadImage={handleUploadImage}
          className="min-h-[420px]"
          placeholder="Write your post content here. Use the toolbar for formatting, code blocks, images, and more."
        />
      </div>

      <div className="rounded-md border p-3 text-xs text-muted-foreground">
        <div className="mb-2 font-medium text-foreground/90">Debug: Current JSON</div>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all">
{JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </section>
  );
}
