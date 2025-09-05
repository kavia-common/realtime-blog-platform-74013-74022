import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "../../components/ui/button";
import { usePostMutations, usePostsListByUser } from "../../convex/hooks";
import { ensureUniqueSlug, toSlug } from "../../lib/slug";
import { StaggerList } from "../../components/animations/StaggerList";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { EmptyState } from "../../components/ui/empty-state";

/**
 * PUBLIC_INTERFACE
 * DashboardHome
 * Realtime dashboard listing posts. Supports create, publish/unpublish, delete.
 */
export default function DashboardHome(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  const posts = usePostsListByUser(userId);
  const loading = posts === undefined;

  const { createPost, publishPost, unpublishPost, deletePost } = usePostMutations();

  const [creating, setCreating] = useState(false);

  const humanDate = useCallback((iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  }, []);

  const sorted = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => {
      const ad = a.updatedAt ? +new Date(a.updatedAt) : 0;
      const bd = b.updatedAt ? +new Date(b.updatedAt) : 0;
      return bd - ad;
    });
  }, [posts]);

  const onCreate = useCallback(async () => {
    setCreating(true);
    try {
      // Create a temp title/slug; user will edit in the editor. Backend should auto-enforce uniqueness.
      const title = "Untitled Post";
      const base = toSlug(title);
      const existingSlugs = (usePostsListByUser(userId) || []).map((p) => p.slug).filter(Boolean) as string[];
      const slug = ensureUniqueSlug(base, existingSlugs);
      const content = JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] });

      const res = (await createPost({ title, slug, content })) as { postId?: string } | void;
      const newId = (res as any)?.postId as string | undefined;

      navigate(`/editor/${newId ?? "new"}`);
    } catch (e) {
      console.warn("Create post failed:", e);
      alert("Create post failed (stub).");
      navigate(`/editor/new`);
    } finally {
      setCreating(false);
    }
  }, [createPost, navigate]);

  const onTogglePublish = useCallback(
    async (postId: string, published: boolean) => {
      try {
        if (published) {
          await unpublishPost({ postId });
        } else {
          await publishPost({ postId });
        }
      } catch (e) {
        console.warn("Publish toggle failed:", e);
        alert("Publish action failed (stub).");
      }
    },
    [publishPost, unpublishPost]
  );

  const onDelete = useCallback(
    async (postId: string) => {
      if (!window.confirm("Delete this post? This cannot be undone.")) return;
      try {
        await deletePost({ postId });
      } catch (e) {
        console.warn("Delete failed:", e);
        alert("Delete failed (stub).");
      }
    },
    [deletePost]
  );

  return (
    <section className="space-y-4">
      <FadeIn as="header" className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={onCreate} disabled={creating}>
          {creating ? "Creating..." : "New Post"}
        </Button>
      </FadeIn>

      {loading ? (
        <FadeIn>
          <LoadingSpinner label="Loading posts…" center />
        </FadeIn>
      ) : sorted.length === 0 ? (
        <FadeIn>
          <EmptyState
            title="No posts yet"
            description="Create your first post to get started."
            action={
              <Button onClick={onCreate}>New Post</Button>
            }
          />
        </FadeIn>
      ) : (
        <StaggerList className="grid gap-3" interval={0.05} y={8}>
          {sorted.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="truncate font-medium">{p.title || "Untitled"}</div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                      p.published
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                    title={p.published ? "Published" : "Draft"}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated {humanDate(p.updatedAt)}
                </div>
                {p.published && p.slug ? (
                  <div className="mt-1 flex items-center gap-2">
                    <a
                      href={`/p/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary underline underline-offset-4"
                    >
                      View Public Page
                    </a>
                    <button
                      type="button"
                      className="text-xs text-foreground/70 hover:text-foreground underline underline-offset-4"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            `${window.location.origin}/p/${p.slug}`
                          );
                          alert("Public URL copied to clipboard.");
                        } catch {
                          alert("Copy failed.");
                        }
                      }}
                      title="Copy share URL"
                    >
                      Copy link
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="ml-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/editor/${p._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={p.published ? "secondary" : "accent"}
                  onClick={() => onTogglePublish(p._id, p.published)}
                  title={p.published ? "Unpublish post" : "Publish post"}
                >
                  {p.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(p._id)}
                  title="Delete post"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </StaggerList>
      )}
    </section>
  );
}
