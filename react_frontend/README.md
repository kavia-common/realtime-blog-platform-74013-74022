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

## Environment Setup

This app is configured via Vite environment variables. Only keys prefixed with `VITE_` are available in the browser. Do not place server-only secrets here.

1) Copy the example file and fill in values:
- cp .env.example .env

2) Required environment variables:
- VITE_CLERK_PUBLISHABLE_KEY
  - What: Clerk publishable key for your application.
  - Where to obtain: Clerk Dashboard → Your application → API Keys → Publishable key.
  - Example: pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
  - Used in: src/auth/clerk.tsx (ClerkProvider configuration)
- VITE_CONVEX_URL
  - What: Public origin URL of your Convex deployment.
  - Where to obtain: After deploying Convex; it typically looks like https://your-deployment.convex.cloud. This also corresponds to the "origin" field in convex.json for local configuration.
  - Example: https://your-deployment.convex.cloud
  - Used in: src/convex/client.ts (ConvexReactClient initialization), src/lib/upload.ts (as a base for upload endpoints)
- VITE_PUBLIC_BASE_URL (optional but recommended)
  - What: The public origin of your frontend app, used to generate absolute links when needed (for example copyable public post URLs).
  - Example (dev): http://localhost:3000
  - Example (prod): https://blog.example.com
  - Used in: link generation and SEO where absolute URLs are beneficial.
- Upload-related variables (optional until you wire a backend for uploads)
  - Current code falls back to temporary object URLs. When enabling real uploads (Convex storage or UploadThing), add client-safe keys here (only publishable keys).
  - Examples:
    - VITE_UPLOADTHING_APP_ID=XXXXXXXX
    - VITE_UPLOADTHING_PUBLIC_API_KEY=XXXXXXXX
    - VITE_UPLOAD_BACKEND=convex
    - VITE_UPLOAD_MAX_SIZE_MB=10

Security notes:
- Never store server-only secrets in `.env` with a `VITE_` prefix since those are exposed to the browser.
- Backend secrets should live in your Convex functions configuration or server-side environment.

## How to Run

- Install dependencies:
  - npm install
- Start development server (port 3000):
  - npm run dev
- Type-check and build:
  - npm run build
- Preview production build:
  - npm run preview

When running in development:
- Ensure `.env` contains VITE_CLERK_PUBLISHABLE_KEY and VITE_CONVEX_URL at minimum.
- The app will warn in the console if values are missing.

## Convex

- Config placeholder in `convex.json`
- Frontend client: `src/convex/client.ts`
- Frontend schema/types: `src/convex/schema.ts`
- Provider: `src/providers/ConvexProvider.tsx` (wraps app in `AppConvexProvider` and syncs Clerk user via `users:upsertUser`)
- Base function names expected on backend:
  - Queries: `posts:listPostsByUser`, `posts:getPostById`, `posts:getPostBySlugPublic`
  - Mutations: `posts:createPost`, `posts:updatePost`, `posts:publishPost`, `posts:unpublishPost`, `posts:deletePost`, `users:upsertUser`

## Image uploads

- The app uses an abstracted upload util at `src/lib/upload.ts`.
- Currently, it falls back to temporary object URLs for local preview.
- To enable production uploads, implement either:
  - A Convex HTTP endpoint (recommended for full-stack control) exposed from your Convex backend that accepts file uploads and returns a public URL, or
  - UploadThing or another storage provider that returns a public URL.
- Once implemented, modify `tryUploadViaConvex` in `src/lib/upload.ts` (or create a new branch based on VITE_UPLOAD_BACKEND) to POST the file to your endpoint and return the URL.

## Routes

- `/` — Home (public)
- `/dashboard` — Protected (requires sign in)
- `/sign-in` — Clerk Sign In
- `/sign-up` — Clerk Sign Up
- `/p/:slug` — Public post viewer (SEO-friendly by slug; uses react-helmet-async for meta tags)

## Scripts

- pnpm/npm/yarn dev — start dev server on port 3000
- pnpm/npm/yarn build — type-check and build
- pnpm/npm/yarn preview — preview production build
