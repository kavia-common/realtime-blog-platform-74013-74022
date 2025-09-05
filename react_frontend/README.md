# Realtime Blog Frontend

Bootstrapped with Vite, converted to React + TypeScript.

- Entry: src/main.tsx
- App shell: src/App.tsx
- Router: react-router-dom with placeholder routes
- HTML mount: index.html with <div id="root" />
- Auth: Clerk integration with `ClerkProvider`, `SignIn`, `SignUp`, `UserButton`
- Protected routes: simple `ProtectedRoute` guard
- Data: Convex client scaffold in `src/convex` with provider `src/providers/ConvexProvider.tsx`
- Editor: TipTap-based rich text editor in `src/components/editor` with image uploads via `src/lib/upload.ts`

Env:
- Copy `.env.example` to `.env` and set:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_CONVEX_URL` (e.g. https://your-deployment.convex.cloud)

Convex:
- Config placeholder in `convex.json`
- Frontend client: `src/convex/client.ts`
- Frontend schema/types: `src/convex/schema.ts`
- Provider: `src/providers/ConvexProvider.tsx` (wraps app in `AppConvexProvider` and syncs Clerk user via `users:upsertUser`)
- Base function names expected on backend:
  - Queries: `posts:listPostsByUser`, `posts:getPostById`, `posts:getPostBySlugPublic`
  - Mutations: `posts:createPost`, `posts:updatePost`, `posts:publishPost`, `posts:unpublishPost`, `posts:deletePost`, `users:upsertUser`

Image uploads:
- The app uses an abstracted upload util at `src/lib/upload.ts`.
- Currently, it falls back to temporary object URLs for local preview.
- To enable production uploads, implement a Convex HTTP endpoint or use Convex storage/UploadThing and return a public URL from `tryUploadViaConvex`.

Routes:
- `/` — Home (public)
- `/dashboard` — Protected (requires sign in)
- `/sign-in` — Clerk Sign In
- `/sign-up` — Clerk Sign Up
- `/p/:slug` — Public post viewer (SEO-friendly by slug; uses react-helmet-async for meta tags)

Scripts:
- pnpm/npm/yarn dev — start dev server on port 3000
- pnpm/npm/yarn build — type-check and build
- pnpm/npm/yarn preview — preview production build
