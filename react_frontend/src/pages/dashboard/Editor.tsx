import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichEditor, { TipTapJSON } from "../../components/editor/Editor";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { uploadImage } from "../../lib/upload";
import { usePostMutations, usePostById, usePostsListByUser } from "../../convex/hooks";
import { ensureUniqueSlug, toSlug } from "../../lib/slug";
import { FadeIn } from "../../components/animations/FadeIn";

/**
 * PUBLIC_INTERFACE
 * EditorPage
 * The post editor with TipTap integration. Real-time subscription to the post document when editing.
 * Auto-saves title and content using Convex mutations with a small debounce.
 * - Route: /editor/:postId
 *   - postId can be "new" for new post flow or a specific id.
 */
export default function EditorPage(): JSX.Element {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isNew = !postId || postId === "new";

  const { createPost, updatePost, publishPost, unpublishPost, deletePost } = usePostMutations();
  const userPosts = usePostsListByUser(); // used to ensure client-side unique slugs

  // Subscribe to existing post when editing
  const post = usePostById(!isNew ? postId : undefined);
  const loading = !isNew && post === undefined;

  // Local state mirrors server fields and updates with live doc
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<TipTapJSON | null>(null);
  const [published, setPublished] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  // Initialize from server doc
  useEffect(() => {
    if (!post) return;
    setTitle(post.title ?? "");
    if (post.content) {
      try {
        setContent(JSON.parse(post.content));
      } catch {
        setContent(null);
      }
    }
    setPublished(!!post.published);
  }, [post]);

  // Debounce helper
  function useDebouncedCallback<T extends unknown[]>(
    fn: { (...args: T): void },
    delay = 600
  ) {
    const timer = useRef<number | null>(null);
    return useCallback(
      (...args: T) => {
        // touch args to satisfy linter in case fn is a no-op in stubs
        void args;
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          fn(...args);
        }, delay);
      },
      [fn, delay]
    );
  }

  // Create on first save if "new"
  const ensurePostId = useCallback(async () => {
    if (!isNew && postId) return postId;
    // Create with minimal content; the user is editing already.
    const base = toSlug(title || "Untitled Post");
    const existingSlugs = (userPosts || []).map((p) => p.slug).filter(Boolean) as string[];
    const slug = ensureUniqueSlug(base, existingSlugs);
    const payload = {
      title: title || "Untitled Post",
      slug,
      content: JSON.stringify(content ?? { type: "doc", content: [{ type: "paragraph" }] }),
    };
    const res = (await createPost(payload)) as { postId?: string } | void;
    const newId = (res as any)?.postId as string | undefined;
    if (newId) {
      navigate(`/editor/${newId}`, { replace: true });
      return newId;
    }
    // Fallback to existing route if backend not implemented
    return postId ?? "new";
  }, [content, createPost, isNew, navigate, postId, title, userPosts]);

  // Auto-save title/content changes
  const debouncedSave = useDebouncedCallback(async (next: { title?: string; content?: TipTapJSON }) => {
    try {
      setSaving(true);
      const id = await ensurePostId();
      if (!id || id === "new") return;

      // If title changed, we also derive a slug (but do not force server to use it unless publishing).
      const slugUpdate =
        next.title !== undefined
          ? {
              slug: ensureUniqueSlug(
                toSlug(next.title || "Untitled Post"),
                (userPosts || []).map((p) => p.slug).filter(Boolean) as string[]
              ),
            }
          : {};

      await updatePost({
        postId: id,
        ...(next.title !== undefined ? { title: next.title } : {}),
        ...(next.content !== undefined ? { content: JSON.stringify(next.content) } : {}),
        ...(slugUpdate.slug ? { slug: slugUpdate.slug } : {}),
      });
    } catch (e) {
      console.warn("Auto-save failed (stub):", e);
    } finally {
      setSaving(false);
    }
  }, 700);

  // Upload implementation via abstracted util (Convex storage or stub)
  const handleUploadImage = useCallback(async (file: File) => {
    const url = await uploadImage(file);
    return url;
  }, []);

  const handleContentChange = useCallback(
    (doc: TipTapJSON) => {
      setContent(doc);
      debouncedSave({ content: doc });
    },
    [debouncedSave]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setTitle(v);
      debouncedSave({ title: v });
    },
    [debouncedSave]
  );

  const handleManualSave = useCallback(async () => {
    try {
      setSaving(true);
      const id = await ensurePostId();
      if (!id || id === "new") return;
      await updatePost({
        postId: id,
        title,
        content: JSON.stringify(content ?? { type: "doc", content: [{ type: "paragraph" }] }),
      });
      alert("Saved");
    } catch (e) {
      console.warn("Save failed (stub):", e);
      alert("Save failed (stub).");
    } finally {
      setSaving(false);
    }
  }, [content, ensurePostId, title, updatePost]);

  const handleTogglePublish = useCallback(async () => {
    try {
      const id = await ensurePostId();
      if (!id || id === "new") return;

      if (published) {
        await unpublishPost({ postId: id });
        setPublished(false);
      } else {
        // Before publishing, ensure slug is set and is unique for SEO
        const base = toSlug(title || "Untitled Post");
        const existingSlugs = (userPosts || []).map((p) => p.slug).filter(Boolean) as string[];
        const slug = ensureUniqueSlug(base, existingSlugs);

        await updatePost({
          postId: id,
          slug,
          title,
          content: JSON.stringify(content ?? { type: "doc", content: [{ type: "paragraph" }] }),
        });
        await publishPost({ postId: id });
        setPublished(true);
      }
    } catch (e) {
      console.warn("Publish toggle failed (stub):", e);
      alert("Publish action failed (stub).");
    }
  }, [ensurePostId, publishPost, unpublishPost, published, title, userPosts, content, updatePost]);

  const handleDelete = useCallback(async () => {
    const id = await ensurePostId();
    if (!id || id === "new") return;
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost({ postId: id });
      navigate("/dashboard");
    } catch (e) {
      console.warn("Delete failed (stub):", e);
      alert("Delete failed (stub).");
    }
  }, [deletePost, ensurePostId, navigate]);

  const headerLabel = useMemo(() => {
    if (isNew) return "Create New Post";
    if (loading) return "Loading…";
    return `Edit Post`;
  }, [isNew, loading]);

  return (
    <section className="space-y-4">
      <FadeIn as="header" className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{headerLabel}</h1>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
              published
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
            title={published ? "Published" : "Draft"}
          >
            {published ? "Published" : "Draft"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {post?.slug && published ? (
            <>
              <a
                href={`/p/${post.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline underline-offset-4"
                title="Open public page"
              >
                View
              </a>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/p/${post.slug}`
                    );
                    alert("Public URL copied to clipboard.");
                  } catch {
                    alert("Copy failed.");
                  }
                }}
                title="Copy public share URL"
              >
                Copy URL
              </Button>
            </>
          ) : null}
          <Button variant={published ? "secondary" : "accent"} onClick={handleTogglePublish}>
            {published ? "Unpublish" : "Publish"}
          </Button>
          <Button onClick={handleManualSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {!isNew && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </FadeIn>

      <FadeIn className="space-y-2">
        <label htmlFor="post-title" className="text-sm text-muted-foreground">
          Title
        </label>
        <Input
          id="post-title"
          placeholder="My awesome blog post"
          value={title}
          onChange={handleTitleChange}
        />
        {post?.slug ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Slug:</span>
            <code className="rounded bg-muted px-1.5 py-0.5">{post.slug}</code>
            {published ? (
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/p/${post.slug}`
                    );
                    alert("Public URL copied to clipboard.");
                  } catch {
                    alert("Copy failed.");
                  }
                }}
              >
                Copy public URL
              </button>
            ) : null}
          </div>
        ) : null}
      </FadeIn>

      <FadeIn>
        <RichEditor
          initialContent={content ?? undefined}
          onChange={handleContentChange}
          onUploadImage={handleUploadImage}
          className="min-h[420px]"
          placeholder="Write your post content here. Use the toolbar for formatting, code blocks, images, and more."
        />
      </FadeIn>

      <FadeIn className="rounded-md border p-3 text-xs text-muted-foreground">
        <div className="mb-2 font-medium text-foreground/90">
          Debug: Current JSON {saving ? "(saving…)" : ""}
        </div>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all">
{JSON.stringify(content, null, 2)}
        </pre>
      </FadeIn>
    </section>
  );
}
