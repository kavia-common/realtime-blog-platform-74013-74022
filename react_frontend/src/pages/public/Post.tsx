import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FadeIn } from "../../components/animations/FadeIn";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { ErrorState } from "../../components/ui/error-state";
import { useQuery } from "../../convex/react-stub";

/**
 * PUBLIC_INTERFACE
 * PublicPostPage
 * Renders a public, read-only post by SEO-friendly slug. Accessible without login.
 * Shows author attribution and content. Uses Helmet for SEO meta tags.
 */
export default function PublicPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState<string>("");

  // Get post by slug from backend (Convex). The stub useQuery returns undefined -> show loading.
  const post = useQuery("posts:getPostBySlugPublic", slug ? { slug } : undefined) as
    | {
        _id: string;
        title: string;
        slug: string;
        content?: string; // JSON stringified TipTap doc
        coverImage?: string;
        published?: boolean;
        author?: { username?: string; avatarUrl?: string };
        updatedAt?: string;
      }
    | undefined;

  const loading = slug && post === undefined;

  // Convert TipTap JSON to a basic HTML string for display without mounting an editor
  useEffect(() => {
    if (!post?.content) {
      setHtml("");
      return;
    }
    try {
      const json = JSON.parse(post.content);
      const generated = tiptapJsonToHtml(json);
      setHtml(generated);
    } catch {
      setHtml("");
    }
  }, [post?.content]);

  const canonicalUrl = useMemo(() => {
    if (!post?.slug) return `${window.location.origin}/p/${slug ?? ""}`;
    return `${window.location.origin}/p/${post.slug}`;
  }, [post?.slug, slug]);

  if (loading) {
    return (
      <section className="space-y-4">
        <FadeIn>
          <LoadingSpinner label="Loading post…" center />
        </FadeIn>
      </section>
    );
  }

  if (!post || post.published === false) {
    return (
      <section className="space-y-4">
        <FadeIn>
          <ErrorState
            title="Post not found"
            message="This post may not exist or is not published."
            small
          />
        </FadeIn>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Helmet>
        <title>{post.title ? `${post.title} • Realtime Blog` : "Post • Realtime Blog"}</title>
        <meta name="description" content={`Read ${post.title || "this post"} on Realtime Blog.`} />
        <link rel="canonical" href={canonicalUrl} />
        {post.coverImage ? <meta property="og:image" content={post.coverImage} /> : null}
        <meta property="og:title" content={post.title || "Post"} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <FadeIn as="header" className="mb-4 space-y-2">
        <h1 className="text-3xl font-bold">{post.title || "Untitled"}</h1>
        {post.author ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={`${post.author.username || "Author"} avatar`}
                className="h-8 w-8 rounded-full border object-cover"
              />
            ) : null}
            <div>
              <div className="font-medium text-foreground/90">
                {post.author.username || "Anonymous"}
              </div>
              {post.updatedAt ? (
                <div className="text-xs">
                  Updated {new Date(post.updatedAt).toLocaleString()}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </FadeIn>

      {post.coverImage ? (
        <FadeIn className="mb-4">
          <img
            src={post.coverImage}
            alt="Cover"
            className="w-full rounded-md border object-cover"
          />
        </FadeIn>
      ) : null}

      <FadeIn>
        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: html || "<p></p>" }}
        />
      </FadeIn>
    </article>
  );
}

/**
 * PUBLIC_INTERFACE
 * tiptapJsonToHtml
 * Minimal renderer converting a subset of TipTap/ProseMirror JSON doc into HTML.
 * This keeps the public page read-only without the editor.
 */
export function tiptapJsonToHtml(doc: any): string {
  if (!doc || doc.type !== "doc") return "";
  const out: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    switch (node.type) {
      case "paragraph": {
        const content = (node.content || []).map(inlineToHtml).join("") || "<br/>";
        out.push(`<p>${content}</p>`);
        break;
      }
      case "heading": {
        const level = node.attrs?.level ?? 1;
        const content = (node.content || []).map(inlineToHtml).join("");
        const tag = `h${Math.min(3, Math.max(1, level))}`;
        out.push(`<${tag}>${content}</${tag}>`);
        break;
      }
      case "blockquote": {
        const inner = (node.content || []).map(blockToHtml).join("");
        out.push(`<blockquote>${inner}</blockquote>`);
        break;
      }
      case "bulletList": {
        const items = (node.content || []).map(blockToHtml).join("");
        out.push(`<ul>${items}</ul>`);
        break;
      }
      case "orderedList": {
        const items = (node.content || []).map(blockToHtml).join("");
        out.push(`<ol>${items}</ol>`);
        break;
      }
      case "listItem": {
        const inner = (node.content || []).map(blockToHtml).join("");
        out.push(`<li>${inner}</li>`);
        break;
      }
      case "codeBlock": {
        const text = (node.content || [])
          .map((n: any) => (n.type === "text" ? escapeHtml(n.text || "") : ""))
          .join("");
        out.push(`<pre><code>${text}</code></pre>`);
        break;
      }
      case "image": {
        const src = node.attrs?.src || "";
        if (src) out.push(`<p><img src="${escapeHtml(src)}" alt="Image" /></p>`);
        break;
      }
      default: {
        // Render children
        (node.content || []).forEach(walk);
      }
    }
  };
  const blockToHtml = (n: any) => {
    const prevLen = out.length;
    walk(n);
    return out.splice(prevLen).join("");
  };
  const inlineToHtml = (n: any): string => {
    if (!n) return "";
    if (n.type === "text") {
      let text = escapeHtml(n.text || "");
      const marks = n.marks || [];
      for (const m of marks) {
        switch (m.type) {
          case "bold":
            text = `<strong>${text}</strong>`;
            break;
          case "italic":
            text = `<em>${text}</em>`;
            break;
          case "strike":
            text = `<s>${text}</s>`;
            break;
          case "code":
            text = `<code>${text}</code>`;
            break;
          case "link":
            {
              const href = escapeHtml(m.attrs?.href || "#");
              text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
            break;
          default:
            break;
        }
      }
      return text;
    }
    if (n.type === "image") {
      const src = n.attrs?.src || "";
      if (src) return `<img src="${escapeHtml(src)}" alt="Image" />`;
      return "";
    }
    // For other inline nodes, try to render their content
    return (n.content || []).map(inlineToHtml).join("");
  };

  (doc.content || []).forEach(walk);
  return out.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
