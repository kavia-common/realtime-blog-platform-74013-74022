import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { ErrorState } from "../../components/ui/error-state";
import { useQuery } from "../../convex/react-stub";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Reads a published post by slug (public view). Displays author, content, likes, and comments.
 * Comments and liking are read-only placeholders here; they will be wired to Convex backend later.
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  const post = useQuery("posts:getPostBySlugPublic", slug ? { slug } : undefined) as
    | {
        _id: string;
        title: string;
        slug: string;
        content?: string;
        coverImage?: string;
        author?: { username?: string; avatarUrl?: string };
        likes?: number;
        comments?: Array<{
          _id: string;
          author?: { username?: string; avatarUrl?: string };
          content: string;
          createdAt?: string;
        }>;
        updatedAt?: string;
      }
    | undefined;

  const loading = post === undefined;
  const contentJson = useMemo(() => {
    if (!post?.content) return null;
    try {
      return JSON.parse(post.content) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [post?.content]);

  if (loading) {
    return (
      <section className="space-y-4">
        <FadeIn>
          <LoadingSpinner label="Loading post…" center />
        </FadeIn>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="space-y-4">
        <FadeIn>
          <ErrorState
            title="Post not found"
            message="This article may be unpublished or the link is incorrect."
          />
        </FadeIn>
      </section>
    );
  }

  const title = post.title || "Untitled";
  const description =
    contentJson && typeof contentJson === "object"
      ? "Read this article on Realtime Blog."
      : "Read this article on Realtime Blog.";
  const canonical = `${window.location.origin}/p/${post.slug}`;

  return (
    <article className="space-y-6">
      <Helmet>
        <title>{title} — Realtime Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {post.coverImage ? <meta property="og:image" content={post.coverImage} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <FadeIn as="header" className="space-y-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          {post.author?.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full border object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border bg-muted" aria-hidden="true" />
          )}
          <div className="text-sm">
            <div className="font-medium text-foreground/90">
              {post.author?.username || "Unknown"}
            </div>
            <div className="text-muted-foreground">
              {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div aria-label="Likes count">❤️ {post.likes ?? 0}</div>
          <a href="#comments" className="underline underline-offset-4">
            💬 {post.comments?.length ?? 0} comments
          </a>
        </div>
      </FadeIn>

      {post.coverImage ? (
        <FadeIn>
          <img
            src={post.coverImage}
            alt=""
            className="w-full rounded-md border object-cover"
          />
        </FadeIn>
      ) : null}

      <FadeIn>
        {/* Content renderer placeholder: In a complete app, you'd render TipTap JSON to HTML.
           For now, we show a pre block to ensure safety. */}
        <div className="prose prose-neutral max-w-none">
          <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto">
{JSON.stringify(contentJson, null, 2)}
          </pre>
        </div>
      </FadeIn>

      <FadeIn as="section" id="comments" className="space-y-3">
        <h2 className="text-lg font-semibold">Comments</h2>
        {post.comments && post.comments.length > 0 ? (
          <ul className="space-y-3">
            {post.comments.map((c) => (
              <li key={c._id} className="rounded-md border p-3">
                <div className="mb-2 flex items-center gap-2">
                  {c.author?.avatarUrl ? (
                    <img
                      src={c.author.avatarUrl}
                      alt=""
                      className="h-6 w-6 rounded-full border object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full border bg-muted" aria-hidden="true" />
                  )}
                  <div className="text-xs">
                    <div className="font-medium">{c.author?.username || "Anonymous"}</div>
                    <div className="text-muted-foreground">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
                <div className="text-sm">{c.content}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            No comments yet.
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Sign in to add comments and like posts in the dashboard/editor experience.
        </div>
      </FadeIn>
    </article>
  );
}
