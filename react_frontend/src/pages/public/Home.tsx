import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FadeIn } from "../../components/animations/FadeIn";
import { StaggerList } from "../../components/animations/StaggerList";
import { EmptyState } from "../../components/ui/empty-state";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { useQuery } from "../../convex/react-stub";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Minimal public homepage listing latest published posts if supported by backend.
 * If backend doesn't provide a public listing query yet, show an empty state.
 * This is a graceful scaffold; replace useQuery with actual convex query when ready.
 */
export default function PublicHome(): JSX.Element {
  // Placeholder: If backend implements posts:listPublished, wire it here.
  // Using stubbed useQuery will return undefined -> we show loading then empty state fallback.
  const publishedPosts = useQuery("posts:listPublished");
  const loading = publishedPosts === undefined;

  const sorted = useMemo(() => {
    if (!Array.isArray(publishedPosts)) return [];
    return [...publishedPosts].sort((a: any, b: any) => {
      const ad = a.updatedAt ? +new Date(a.updatedAt) : 0;
      const bd = b.updatedAt ? +new Date(b.updatedAt) : 0;
      return bd - ad;
    });
  }, [publishedPosts]);

  const siteTitle = "Realtime Blog";
  const siteDesc = "A real-time blogging platform with rich text editing, publishing, and public viewing.";

  return (
    <section className="space-y-4">
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <link rel="canonical" href={`${window.location.origin}/`} />
      </Helmet>

      <FadeIn as="header" className="space-y-1">
        <h1 className="text-2xl font-semibold">Latest Posts</h1>
        <p className="text-sm text-muted-foreground">
          Read published posts from our authors.
        </p>
      </FadeIn>

      {loading ? (
        <FadeIn>
          <LoadingSpinner label="Loading posts…" center />
        </FadeIn>
      ) : sorted.length === 0 ? (
        <FadeIn>
          <EmptyState
            title="No posts published yet"
            description="Come back later for fresh content."
          />
        </FadeIn>
      ) : (
        <StaggerList className="grid gap-3">
          {sorted.map((p: any) => (
            <article key={p._id} className="rounded-md border p-4">
              <header className="mb-1 flex items-center gap-3">
                <h2 className="text-lg font-medium truncate">{p.title || "Untitled"}</h2>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border bg-green-50 text-green-700 border-green-200">
                  Published
                </span>
              </header>
              {p.author ? (
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {p.author.avatarUrl ? (
                    <img
                      src={p.author.avatarUrl}
                      alt={`${p.author.username || "Author"} avatar`}
                      className="h-5 w-5 rounded-full border object-cover"
                    />
                  ) : null}
                  <span>By {p.author.username || "Anonymous"}</span>
                </div>
              ) : null}
              <div className="text-sm text-muted-foreground line-clamp-2">
                {/* If the backend provides an excerpt/summary, render here; otherwise leave blank */}
              </div>
              {p.slug ? (
                <div className="mt-2">
                  <Link
                    to={`/p/${p.slug}`}
                    className="text-sm text-primary underline underline-offset-4"
                    aria-label={`Read ${p.title || "post"}`}
                  >
                    Read post →
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </StaggerList>
      )}
    </section>
  );
}
