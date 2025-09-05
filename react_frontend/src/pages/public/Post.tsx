import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "../../convex/react-stub";
import { queries } from "../../convex/schema";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Displays a published post by slug. Uses a stubbed Convex query in this scaffold.
 * Adds SEO metadata via Helmet and includes accessible author info.
 */
export default function PublicPostPage(): JSX.Element {
  const { slug = "" } = useParams<{ slug: string }>();

  // In a fully wired app, this will query Convex for the public post by slug.
  // Using any[] for the stubbed environment to avoid strict typing issues.
  const posts = useQuery(queries.getPostBySlugPublic as any, { slug }) as any[] | undefined;

  const post: any = (posts || []).find((p: any) => p?.slug === slug);

  if (!post) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-sm text-muted-foreground">
          This post may have been unpublished or deleted.
        </p>
      </div>
    );
  }

  const title: string = post?.title ?? "Untitled";
  const author = post?.author ?? {};
  const authorName: string = author?.username || "Anonymous";
  const avatarUrl: string | undefined = author?.avatarUrl;
  const content: string = post?.content || "";

  return (
    <article className="prose max-w-[800px]">
      <Helmet>
        <title>{title} • Realtime Blog</title>
        <meta name="description" content={title} />
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />
      </Helmet>

      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="mt-2 flex items-center gap-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={authorName || "Author avatar"}
            className="h-8 w-8 rounded-full border object-cover"
          />
        ) : null}
        <div className="text-sm text-muted-foreground">{authorName}</div>
      </div>

      <div className="mt-6 whitespace-pre-wrap break-words">
        {/* Content is stored as TipTap JSON string in the real app; we display as text fallback for now */}
        {content}
      </div>
    </article>
  );
}
