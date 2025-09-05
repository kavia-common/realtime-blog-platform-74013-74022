import React from "react";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { EmptyState } from "../../components/ui/empty-state";

/**
 * PUBLIC_INTERFACE
 * PublicHome
 * Minimal landing page listing recent published posts (placeholder for now).
 * Replace placeholder data with a real public posts query when backend is ready.
 */
export default function PublicHome(): JSX.Element {
  // Placeholder listings; replace with real query later.
  const loading = false;
  const posts: Array<{ title: string; slug: string }> = [];

  return (
    <section className="space-y-4">
      <FadeIn as="header" className="space-y-1">
        <h1 className="text-2xl font-semibold">Latest Posts</h1>
        <p className="text-sm text-muted-foreground">
          Fresh stories from our authors.
        </p>
      </FadeIn>

      {loading ? (
        <FadeIn>
          <LoadingSpinner label="Loading posts…" center />
        </FadeIn>
      ) : posts.length === 0 ? (
        <FadeIn>
          <EmptyState
            title="No posts published yet"
            description="Once posts are published, they will appear here."
          />
        </FadeIn>
      ) : (
        <div className="grid gap-3">
          {posts.map((p) => (
            <a
              key={p.slug}
              href={`/p/${p.slug}`}
              className="rounded-md border p-3 no-underline hover:bg-muted/40"
            >
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">/p/{p.slug}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
