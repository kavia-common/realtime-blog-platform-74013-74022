import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { queries } from "../../convex/schema";
import { useQuery as useConvexQuery } from "../../convex/react-stub";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Read-only public viewer of a published post by slug.
 * - Route: /p/:slug
 * - Loads post via Convex query "posts:getPostBySlugPublic"
 * - Sets SEO meta tags using react-helmet-async
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  // In real app: useConvexQuery(queries.getPostBySlugPublic, { slug })
  // Using stub, returns undefined; we keep a local emulation to avoid crashing.
  const post = useConvexQuery(queries.getPostBySlugPublic as any, slug ? { slug } : undefined) as
    | {
        _id: string;
        title: string;
        slug: string;
        content?: string;
        coverImage?: string;
        published?: boolean;
        author?: { username?: string; avatarUrl?: string };
        updatedAt?: string;
      }
    | undefined;

  // Local derived content from TipTap JSON string to HTML for basic rendering
  const [html, setHtml] = useState<string>("");

  // Convert a minimal subset of TipTap JSON to HTML (very limited)
  useEffect(() => {
    if (!post?.content) {
      setHtml("");
      return;
    }
    try {
      const doc = JSON.parse(post.content) as any;
      // naive conversion: paragraphs to <p>, headings to <h1..h3>, code blocks to <pre><code>
      const out: string[] = [];
      const blocks: any[] = Array.isArray(doc?.content) ? doc.content : [];
      for (const node of blocks) {
        switch (node.type) {
          case "heading": {
            const level = Math.min(Math.max(Number(node.attrs?.level || 1), 1), 3);
            const text = extractText(node);
            out.push(`<h${level}>${escapeHtml(text)}</h${level}>`);
            break;
          }
          case "paragraph": {
            const text = extractText(node);
            out.push(`<p>${escapeHtml(text)}</p>`);
            break;
          }
          case "codeBlock": {
            const text = extractText(node);
            out.push(`<pre><code>${escapeHtml(text)}</code></pre>`);
            break;
          }
          case "blockquote": {
            const text = extractText(node);
            out.push(`<blockquote>${escapeHtml(text)}</blockquote>`);
            break;
          }
          case "bulletList": {
            const items = (node.content || []).map((li: any) => `<li>${escapeHtml(extractText(li))}</li>`).join("");
            out.push(`<ul>${items}</ul>`);
            break;
          }
          case "orderedList": {
            const items = (node.content || []).map((li: any) => `<li>${escapeHtml(extractText(li))}</li>`).join("");
            out.push(`<ol>${items}</ol>`);
            break;
          }
          case "image": {
            const src = node.attrs?.src;
            if (src) out.push(`<img src="${escapeAttr(src)}" alt="" />`);
            break;
          }
          default: {
            const text = extractText(node);
            if (text) out.push(`<p>${escapeHtml(text)}</p>`);
            break;
          }
        }
      }
      setHtml(out.join("\n"));
    } catch {
      setHtml("");
    }
  }, [post?.content]);

  const title = post?.title ?? (slug ? humanizeSlug(slug) : "Post");
  const description = useMemo(() => {
    // simple description from first 160 chars of text content
    const tmp = stripHtml(html);
    return tmp.slice(0, 160);
  }, [html]);
  const cover = post?.coverImage;

  if (!slug) {
    return <div className="text-sm text-muted-foreground">Invalid URL.</div>;
  }

  if (post === undefined) {
    // Loading (Convex stub returns undefined; in real app would resolve)
    return <div className="text-sm text-muted-foreground">Loading post…</div>;
  }

  // If backend returns null for unpublished or not found, show 404-ish
  if (!post) {
    return (
      <>
        <Helmet>
          <title>Not found | Realtime Blog</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Post not found</h1>
          <p className="text-sm text-muted-foreground">This post may be unpublished or the link is invalid.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} | Realtime Blog</title>
        <meta name="description" content={description || "Blog post"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || "Blog post"} />
        {cover ? <meta property="og:image" content={cover} /> : null}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content={cover ? "summary_large_image" : "summary"} />
        {cover ? <meta name="twitter:image" content={cover} /> : null}
      </Helmet>

      <article className="prose prose-neutral max-w-none">
        {cover ? (
          <div className="mb-4">
            <img src={cover} alt="" className="w-full rounded-md" />
          </div>
        ) : null}
        <h1>{title}</h1>
        {/* Render read-only HTML. The conversion is intentionally minimal. */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
}

/** Extracts plain text from a TipTap node tree */
function extractText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return String(node.text ?? "");
  const children: any[] = Array.isArray(node.content) ? node.content : [];
  return children.map(extractText).join("");
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(s: string): string {
  // A basic attribute escape; in production consider a robust sanitizer.
  return escapeHtml(s);
}
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function humanizeSlug(s: string): string {
  return s.replace(/-/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}
