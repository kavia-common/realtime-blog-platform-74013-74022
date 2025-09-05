/**
 * Convex client initialization for the frontend app.
 * PUBLIC_INTERFACE
 * getConvexUrl reads the Convex deployment URL from environment variables.
 * PUBLIC_INTERFACE
 * convex is a singleton instance of the Convex React client for queries/mutations.
 *
 * Env requirements (request from orchestrator to populate .env):
 * - VITE_CONVEX_URL = "https://<your-deployment>.convex.cloud"
 */
/* Import from local stub to avoid requiring the real convex/react during build */
import { ConvexReactClient as AnyConvexReactClient } from "./react-stub";

/**
 * PUBLIC_INTERFACE
 * getConvexUrl
 * Returns the Convex deployment URL from Vite environment variables.
 */
export function getConvexUrl(): string {
  const url = (import.meta.env as Record<string, unknown>)["VITE_CONVEX_URL"] as string | undefined;
  if (!url) {
    console.warn(
      "Convex URL missing. Please set VITE_CONVEX_URL in your environment to your Convex deployment URL."
    );
    return ""; // Return empty for now; provider guards against using an empty URL.
  }
  return url;
}

/**
 * PUBLIC_INTERFACE
 * createConvexClient
 * Creates a ConvexReactClient instance from the configured URL.
 * Returns `any` to avoid build-time type dependency on convex/react types.
 */
export function createConvexClient(): any | null {
  const url = getConvexUrl();
  if (!url) return null;
  return new (AnyConvexReactClient as any)(url);
}

/**
 * PUBLIC_INTERFACE
 * convex
 * Singleton client instance (may be null if env is not configured).
 * Prefer using ConvexProvider which guards and handles null safely.
 */
export const convex: any | null = createConvexClient();
