import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StaggerList } from "../../components/animations/StaggerList";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { EmptyState } from "../../components/ui/empty-state";
import { useQuery } from "../../convex/react-stub";

/**
 * PUBLIC_INTERFACE
 * Home (Public)
 * Displays a list of recently published posts with author info and interaction counts.
 * Real-time data will be driven via Convex query once backend is implemented.
 */
export default function PublicHome(): JSX.Element {
  // Using the stubbed useQuery to keep compile-time OK.
  // Replace with concrete query e.g., useConvexQuery(queries.listPublishedPosts)
  const posts = useQuery("posts:listPublishedPosts") as
    | Array<{
        _id: string;
        title: string;
        slug: string;
        coverImage?: string;
        author?: { username?: string; avatarUrl?: string };
        likes?: number;
        commentsCount?: number;
        updatedAt?: string;
      }>
    | undefined;

  const loading = posts === undefined;
  const sorted = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => {
      const ad = a.updatedAt ? +new Date(a.updatedAt) : 0;
      const bd = b.updatedAt ? +new Date(b.updatedAt) : 0;
      return bd - ad;
    });
  }, [posts]);

  return (
    <section className="space-y-6">
      <Helmet>
        <title>Realtime Blog — Explore</title>
        <meta name="description" content="Read the latest posts from our community." />
        <link rel="canonical" href={`${window.location.origin}/`} />
      </Helmet>

      <FadeIn as="header" className="space-y-1">
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Discover recently published posts. Sign in to write your own.
        </p>
      </FadeIn>

      {loading ? (
        <FadeIn>
          <LoadingSpinner label="Loading posts…" center />
        </FadeIn>
      ) : sorted.length === 0 ? (
        <FadeIn>
          <EmptyState
            title="No posts yet"
            description="When authors publish, their posts will appear here."
          />
        </FadeIn>
      ) : (
        <StaggerList className="grid gap-4">
          {sorted.map((p) => (
            <Link
              to={`/p/${p.slug}`}
              key={p._id}
              className="group rounded-md border hover:shadow-sm transition-shadow no-underline"
              aria-label={`Open post: ${p.title}`}
            >
              <article className="grid gap-3 p-4">
                <div className="flex items-center gap-3">
                  {p.author?.avatarUrl ? (
                    <img
                      src={p.author.avatarUrl}
                      alt=""
                      className="h-8 w-8 rounded-full border object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border bg-muted" aria-hidden="true" />
                  )}
                  <div className="text-xs">
                    <div className="font-medium text-foreground/90">
                      {p.author?.username || "Unknown"}
                    </div>
                    <div className="text-muted-foreground">
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {p.title || "Untitled"}
                </h2>

                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt=""
                    className="mt-1 aspect-[16/9] w-full rounded-md object-cover border"
                  />
                ) : null}

                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <div aria-label="Likes count">❤️ {p.likes ?? 0}</div>
                  <div aria-label="Comments count">💬 {p.commentsCount ?? 0}</div>
                </div>
              </article>
            </Link>
          ))}
        </StaggerList>
      )}
    </section>
  );
}
