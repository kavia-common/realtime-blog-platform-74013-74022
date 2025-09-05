/**
 * Temporary lightweight stub for convex/react to allow the app to build
 * before installing the actual dependency. Replace usages with the real
 * package once dependencies are installed.
 *
 * Provides:
 * - ConvexReactClient (minimal constructor with URL)
 * - ConvexProvider (React context provider passthrough)
 * - useMutation (returns a no-op async function)
 * - useQuery (returns undefined)
 */
import React, { createContext } from "react";

export class ConvexReactClient {
  url: string;
  constructor(url: string) {
    this.url = url;
  }
}

const Ctx = createContext<{ client: ConvexReactClient | null }>({ client: null });

export function ConvexProvider({
  client,
  children,
}: {
  client: ConvexReactClient;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ client }}>{children}</Ctx.Provider>;
}

export function useMutation(name?: string) {
  // reference name to avoid unused var warnings in lint
  void name;
  // Return a function that resolves immediately to mimic mutation signature
  return async function noop(...args: unknown[]) {
    void args; // prevent unused var warning
    return Promise.resolve(undefined);
  };
}

export function useQuery(...args: unknown[]) {
  void args; // prevent unused var warning
  // Queries return undefined in this stub
  return undefined as unknown;
}
