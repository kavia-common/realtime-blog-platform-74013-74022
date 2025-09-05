/**
 * ConvexProvider wraps the app and provides the Convex client via context.
 * It also performs a lightweight "upsertUser" sync on sign-in using Clerk.
 *
 * This is a frontend-only scaffold; actual backend functions must exist
 * in the Convex project with matching names for queries/mutations.
 */
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { ConvexProvider as ConvexProviderReact, useMutation } from "../convex/react-stub";
import { useAuth, useUser } from "@clerk/clerk-react";
import { convex, createConvexClient } from "../convex/client";
import { mutations, UpsertUserInput } from "../convex/schema";

/**
 * PUBLIC_INTERFACE
 * ConvexClientContext provides access to the Convex client (may be null if not configured).
 */
const ConvexClientContext = createContext<{ client: ReturnType<typeof createConvexClient> }>({
  client: convex,
});

/**
 * PUBLIC_INTERFACE
 * useConvexClient
 * Hook to obtain the Convex client instance.
 */
export function useConvexClient() {
  return useContext(ConvexClientContext).client;
}

/**
 * PUBLIC_INTERFACE
 * AppConvexProvider
 * Wraps children with ConvexProvider from convex/react when Convex URL is configured.
 * Also triggers a user upsert mutation when the Clerk session is ready and signed in.
 */
export function AppConvexProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => convex ?? createConvexClient(), []);
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // We can call mutations via a lightweight nested component that has access to ConvexProvider
  function UpsertUserOnSignIn() {
    const upsertUser = useMutation(mutations.upsertUser);

    useEffect(() => {
      async function run() {
        if (!isLoaded || !isSignedIn || !user) return;
        try {
          const input: UpsertUserInput = {
            clerkId: user.id,
            username: user.username ?? user.primaryEmailAddress?.emailAddress?.split("@")[0] ?? `user-${user.id.slice(-6)}`,
            avatarUrl: user.imageUrl,
          };
          // Fire-and-forget; no need to await UI on success
          await upsertUser(input);
        } catch (e) {
          // Non-fatal: we only log to avoid blocking UI
          console.warn("Convex upsertUser failed or not yet implemented on backend:", e);
        }
      }
      void run();
    }, [isLoaded, isSignedIn, upsertUser, user]);

    return null;
  }

  // If client is not configured (missing env), render children without Convex context.
  if (!client) {
    return (
      <ConvexClientContext.Provider value={{ client: null }}>
        {children}
      </ConvexClientContext.Provider>
    );
  }

  return (
    <ConvexClientContext.Provider value={{ client }}>
      <ConvexProviderReact client={client}>
        <UpsertUserOnSignIn />
        {children}
      </ConvexProviderReact>
    </ConvexClientContext.Provider>
  );
}
