import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Displays a published post by slug on a public URL.
 * Note: In this scaffold, data loading is not wired to Convex yet; replace with real hook when backend is ready.
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  // Placeholder flags and post data; integrate with real query later.
  const loading = false;
  const error = false;
  type PublicPost = {
    title?: string;
    content?: string;
    author?: { username?: string; avatarUrl?: string } | null;
  } | null;

  const post: PublicPost = null;

  const title = useMemo<string>(() => {
    if (post && post.title) return post.title;
    if (slug) return slug.replace(/-/g, " ");
    return "Post";
  }, [post, slug]);

  if (loading) {
    return (
      <section>
        <FadeIn>
          <LoadingSpinner label="Loading post…" center />
        </FadeIn>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <FadeIn>
          <ErrorState
            title="Failed to load"
            message="We couldn't load this post. Please refresh and try again."
          />
        </FadeIn>
      </section>
    );
  }

  if (!post) {
    return (
      <section>
        <Helmet>
          <title>{title} • Realtime Blog</title>
          <meta name="description" content="A blog post" />
        </Helmet>
        <FadeIn>
          <EmptyState
            title="Post unavailable"
            description="This post may have been unpublished or does not exist."
          />
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-[800px] gap-6">
      <Helmet>
        <title>{post && post.title ? post.title : ""} • Realtime Blog</title>
        <meta name="description" content={post && post.title ? post.title : ""} />
      </Helmet>

      <FadeIn as="header" className="space-y-2">
        <h1 className="text-3xl font-semibold">{post?.title ?? ""}</h1>
        {post && post.author ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.author && post.author.avatarUrl ? (
              <img
                alt={post.author.username || "Author"}
                src={post.author.avatarUrl}
                className="h-6 w-6 rounded-full border object-cover"
              />
            ) : null}
            <span>{(post.author && post.author.username) || "Unknown author"}</span>
          </div>
        ) : null}
      </FadeIn>

      <FadeIn>
        <article className="prose prose-neutral max-w-none">
          {/* Content would be rendered from JSON or HTML. For now, placeholder. */}
          <p>This public post content will appear here once connected to the backend.</p>
        </article>
      </FadeIn>
    </section>
  );
}
